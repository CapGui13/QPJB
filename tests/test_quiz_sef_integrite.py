"""Tests du garde-fou de données ; aucune dépendance tierce."""
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import verify_quiz_sef as checker


def valid_question():
    return {
        "id": "SEF-TEST-001", "theme": "ouv",
        "hand": [["A", "R", "D", "V"], ["10", "9", "8"], ["7", "6", "5"], ["4", "3", "2"]],
        "h": 10, "shape": [4, 3, 3, 3], "auction": [], "context": "Quelle ouverture ?",
        "answer": "1♣", "choices": ["1♣", "Passe", "1SA", "1♦"],
        "explain": "Exercice de validation des données.", "difficulty": 1
    }


class QuizSEFIntegrityTests(unittest.TestCase):
    def test_correct_question(self):
        result = checker.inspect([valid_question()], source="test", known_themes={"ouv"})
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["warnings"], [])

    def test_bad_h_and_shape(self):
        q = valid_question(); q["h"] = 9; q["shape"] = [3, 4, 3, 3]
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertEqual(len(result["errors"]), 2)

    def test_duplicate_card_and_wrong_answer(self):
        q = valid_question(); q["hand"][1][0] = q["hand"][1][1]
        q["answer"] = "2♠"
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertTrue(any("doublon de carte" in e for e in result["errors"]))
        self.assertTrue(any("clé n'apparaît" in e for e in result["errors"]))

    def test_card_order_warning(self):
        q = valid_question(); q["hand"][2] = ["5", "7", "6"]
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertEqual(result["errors"], [])
        self.assertEqual(result["wrong_card_order"], 1)

    def test_duplicate_id_between_lots(self):
        q = valid_question()
        result = checker.inspect([q], source="test", known_themes={"ouv"}, taken_ids={q["id"]})
        self.assertTrue(any("ID déjà présent" in e for e in result["errors"]))

    def test_catalogue_json_extraction(self):
        payload = {"version": "test", "themes": [{"id": "ouv"}], "exercises": [valid_question()]}
        with tempfile.TemporaryDirectory() as d:
            html_file = Path(d) / "quizz.html"
            html_file.write_text('<html><script type="application/json" id="training-data">'
                                 + json.dumps(payload, ensure_ascii=False) + '</script></html>', encoding="utf-8")
            exercises, themes, version = checker.load_catalogue(html_file)
        self.assertEqual(len(exercises), 1)
        self.assertEqual(themes, {"ouv"})
        self.assertEqual(version, "test")

    def test_non_text_cards_or_choices_are_rejected(self):
        q = valid_question()
        q["hand"][0][0] = 14
        q["choices"][0] = 1
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertTrue(any("chaînes de caractères" in e for e in result["errors"]))
        self.assertTrue(any("textuels" in e for e in result["errors"]))

    def test_non_bid_choices_are_rejected(self):
        q = valid_question()
        q["choices"][1] = "Une enchère au hasard"
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertTrue(any("enchère SEF reconnue" in e for e in result["errors"]))

    def test_noncanonical_bid_spelling_is_rejected(self):
        q = valid_question()
        q["choices"][1] = "3NT"
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertTrue(any("enchère SEF reconnue" in e for e in result["errors"]))

    def test_boolean_values_are_not_numbers(self):
        q = valid_question()
        q["h"] = True
        q["difficulty"] = True
        result = checker.inspect([q], source="test", known_themes={"ouv"})
        self.assertTrue(any("H déclarés" in e for e in result["errors"]))
        self.assertTrue(any("difficulté invalide" in e for e in result["errors"]))

    def test_staging_unsorted_cards_block_cli(self):
        payload = {"version": "test", "themes": [{"id": "ouv"}], "exercises": [valid_question()]}
        q = valid_question()
        q["id"] = "SEF-TEST-002"
        q["hand"][2] = ["5", "7", "6"]
        with tempfile.TemporaryDirectory() as folder:
            h = Path(folder) / "quizz.html"
            h.write_text('<script id="training-data" type="application/json">'
                         + json.dumps(payload, ensure_ascii=False) + '</script>', encoding="utf-8")
            stage = Path(folder) / "lot.json"
            stage.write_text(json.dumps([q], ensure_ascii=False), encoding="utf-8")
            result = subprocess.run([sys.executable, str(Path(checker.__file__)),
                                     "--html", str(h), "--staging", str(stage)],
                                    capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 1)
            self.assertIn("cartes mal classées", result.stderr)
            q["hand"][2] = ["7", "6", "5"]
            stage.write_text(json.dumps([q], ensure_ascii=False), encoding="utf-8")
            result = subprocess.run([sys.executable, str(Path(checker.__file__)),
                                     "--html", str(h), "--staging", str(stage)],
                                    capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_malformed_catalogue_question_fails_cleanly(self):
        payload = {"version": "test", "themes": [{"id": "ouv"}],
                   "exercises": [valid_question(), None]}
        with tempfile.TemporaryDirectory() as folder:
            h = Path(folder) / "quizz.html"
            h.write_text('<script id="training-data" type="application/json">'
                         + json.dumps(payload, ensure_ascii=False) + '</script>', encoding="utf-8")
            result = subprocess.run([sys.executable, str(Path(checker.__file__)),
                                     "--html", str(h)], capture_output=True,
                                    text=True, check=False)
            self.assertEqual(result.returncode, 1)
            self.assertIn("objet JSON attendu", result.stderr)
            self.assertNotIn("Traceback", result.stderr)

    def test_role_sensitive_similarity_only_a_warning(self):
        q = valid_question(); q["auction"] = ["Partenaire : 1♣", "Adversaire : 1♠"]
        first = checker.auction_signature(q["auction"])
        second = checker.auction_signature(["Adversaire : 1♣", "Partenaire : 1♠"])
        self.assertNotEqual(first, second)
        result = checker.inspect([q], source="staging", known_themes={"ouv"},
                                 published={(first, "1♣"): [q]})
        self.assertEqual(result["errors"], [])
        self.assertEqual(len(result["pedagogical_overlap_signals"]), 1)


if __name__ == "__main__":
    unittest.main()