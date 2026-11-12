"""Tests du diagnostic de légalité formelle ; n'évaluent PAS le SEF."""
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import audit_quiz_auction_legality as audit

BASE = {
    'id': 'SEF-TEST-001',
    'auction': ['Adversaire : 1♣', 'Partenaire : Contre', 'Adversaire : Passe'],
    'choices': ['Passe', '1♦', '1♥', '1♠'],
    'answer': '1♥',
}


class AuctionLegalityTests(unittest.TestCase):
    def check(self, auction=None, choices=None, complete_rotation=False):
        q = copy.deepcopy(BASE)
        if auction is not None:
            q['auction'] = auction
        if choices is not None:
            q['choices'] = choices
        return audit.inspect_question(q, complete_rotation=complete_rotation)

    def test_cas_valide(self):
        r = self.check()
        self.assertEqual((r['status'], r['checked_choices']), ('CONFORME', 4))

    def test_contrat_descendant(self):
        r = self.check(['Partenaire : 1♠', 'Adversaire : Passe',
                        'Vous : 1♥', 'Adversaire : Passe'])
        self.assertEqual(r['status'], 'ANOMALIE')
        self.assertIn('contrat non supérieur', ' '.join(r['anomalies']))

    def test_rotation_incompatible(self):
        r = self.check(['Partenaire : 1♣', 'Vous : 1♥'], complete_rotation=True)
        self.assertIn('Rotation', ' '.join(r['anomalies']))

    def test_contre_du_meme_camp(self):
        r = self.check(['Partenaire : 1♠', 'Adversaire : Passe',
                        'Vous : Contre', 'Adversaire : Passe'])
        self.assertIn('Contre interdit', ' '.join(r['anomalies']))

    def test_surcontre_impossible(self):
        r = self.check(choices=['Passe', '1♦', 'Surcontre', '1♠'])
        self.assertIn('Surcontre', ' '.join(r['anomalies']))

    def test_surcontre_apres_contre_adverse(self):
        r = self.check(['Partenaire : 1♣', 'Adversaire : Contre'],
                       ['Passe', 'Surcontre', '1♦', '1♠'])
        self.assertEqual(r['status'], 'CONFORME')

    def test_contrat_insuffisant_dans_choix(self):
        r = self.check(['Adversaire : 2♦', 'Partenaire : Passe', 'Adversaire : Passe'],
                       ['Passe', '1♠', '2♥', '3♥'])
        self.assertIn('1♠', ' '.join(r['anomalies']))

    def test_quatre_passe_cloture(self):
        r = self.check(['Adversaire : Passe', 'Partenaire : Passe',
                        'Adversaire : Passe', 'Vous : Passe'])
        self.assertIn('terminée', ' '.join(r['anomalies']))

    def test_trois_passe_apres_contrat_cloture(self):
        r = self.check(['Vous : 1♣', 'Adversaire : Passe',
                        'Partenaire : Passe', 'Adversaire : Passe'])
        self.assertIn('terminée', ' '.join(r['anomalies']))

    def test_une_annonce_apres_cloture(self):
        r = self.check(['Adversaire : 1♣', 'Partenaire : Passe',
                        'Adversaire : Passe', 'Vous : Passe', 'Adversaire : 1♦'])
        self.assertIn('après clôture', ' '.join(r['anomalies']))

    def test_annonce_incomprise_est_non_analysable(self):
        r = self.check(['Adversaire : ouverture mystérieuse'])
        self.assertEqual(r['status'], 'NON_ANALYSABLE')

    def test_choix_inconnu_est_non_analysable(self):
        r = self.check(choices=['Passe', '1♦', '3NT', '1♠'])
        self.assertEqual(r['status'], 'NON_ANALYSABLE')

    def test_annotation_parenthetique_acceptee(self):
        self.assertEqual(audit.parse_bid('1SA (15–17 H)'), ('CONTRAT', 9))
        self.assertEqual(audit.parse_bid('1♣ et plus'), ('INCONNU', None))

    def test_un_surcontre_avec_passe_intermediaire(self):
        r = self.check(['Partenaire : 1♣', 'Adversaire : Contre',
                        'Vous : Passe', 'Adversaire : Passe'],
                       ['Passe', 'Surcontre', '1♦', '1♠'], complete_rotation=True)
        # Sud vient déjà de passer : le prochain joueur n'est pas Sud.
        self.assertEqual(r['status'], 'ANOMALIE')
        self.assertIn('Rotation', ' '.join(r['anomalies']))

    def test_sequence_abregee_avec_passe_implicite(self):
        # Dans les anciennes fiches, le Passe de l'adversaire est parfois omis.
        r = self.check(['Partenaire : 1♣'])
        self.assertEqual(r['status'], 'CONFORME')
        strict = self.check(['Partenaire : 1♣'], complete_rotation=True)
        self.assertEqual(strict['status'], 'ANOMALIE')

    def test_staging_complet_controle_rotation_stricte(self):
        r = self.check(complete_rotation=True)
        self.assertEqual(r['status'], 'CONFORME')

    def test_reveals_skipped_status_not_false_success(self):
        r = audit.audit([{'id': 'X', 'auction': 'pas une liste', 'choices': []}], 'test')
        self.assertEqual((r['conformes'], r['non_analysables']), (0, 1))

    def test_cli_informatif_et_strict(self):
        with tempfile.TemporaryDirectory() as d:
            file = Path(d) / 'lot.json'
            bad = copy.deepcopy(BASE)
            bad['choices'][0] = 'Surcontre'
            file.write_text(json.dumps([bad], ensure_ascii=False), encoding='utf-8')
            script = Path(audit.__file__)
            run = lambda extra: subprocess.run([sys.executable, str(script),
                                               '--staging', str(file), *extra],
                                              capture_output=True, text=True, check=False)
            self.assertEqual(run([]).returncode, 0)
            self.assertEqual(run(['--strict']).returncode, 1)


if __name__ == '__main__':
    unittest.main()