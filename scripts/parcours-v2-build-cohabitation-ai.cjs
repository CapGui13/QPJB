'use strict';
/* QPJB AI — reversible same-origin coexistence prototype, NOT a site change.
 * V2 uses its own localStorage key; V1 and historical quiz data are READ ONLY.
 * Generated HTML can be served from /QPJB/artifacts/v2-ai/ beside quizz.html.
 * No account authentication or V1->V2 mastery inference is attempted.
 */
const fs=require('node:fs');
const path=require('node:path');
const AG=require('./parcours-v2-build-reprise-ag.cjs');
const ROOT=path.resolve(__dirname,'..');
const SRC=path.join(ROOT,'preview','parcours-v2-autonome.html');
const DEST=path.join(ROOT,'artifacts','v2-ai','parcours-v2-cohabitation.html');
const V1_KEY='qpjb-sef-parcours-01';
const V1_TRAINING_KEY='qpjb-sef-entrainement-01';
const V2_KEY='qpjb-sef-parcours-v2-01';
const AG_KEY='qpjb-preview-v2-ag-local-resume-v1';
const LEGACY_SCRIPT=String.raw