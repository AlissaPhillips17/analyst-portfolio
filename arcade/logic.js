/* Pure decision logic shared by the page and validation checks. */
(function(root){
 const correct = ['deduplicate', 'validate', ['denominator','identity']];
 function evaluate(mission, answers){
  if (!Number.isInteger(mission) || mission < 0 || mission > 2 || !Array.isArray(answers)) return false;
  const selected = [...new Set(answers)].sort();
  const expected = Array.isArray(correct[mission]) ? [...correct[mission]].sort() : [correct[mission]];
  return selected.length === expected.length && selected.every((v,i)=>v===expected[i]);
 }
 function cleanProgress(value){return Array.isArray(value) ? [...new Set(value.filter(x=>Number.isInteger(x)&&x>=0&&x<3))] : [];}
 const logic={evaluate,cleanProgress};
 if(typeof module !== 'undefined' && module.exports) module.exports=logic;
 root.LabLogic=logic;
})(typeof window==='undefined'?globalThis:window);
