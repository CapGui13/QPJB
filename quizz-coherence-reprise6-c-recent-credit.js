'use strict';
const P=require('./quizz-coherence-reprise6-c-debt-credit.js'),expertise=require('./quizz-coherence-reprise6-c-expertise.js');
module.exports=Object.freeze({exchange:ctx=>P.exchange({...ctx,expertise},'recent')});
