(function(root){
 function cents(value){if(value===null||value===undefined||String(value).trim()==='')return null;const n=Number(value);return Number.isFinite(n)&&n>=0?Math.round(n*100):null;}
 function priceReady(values,expected){return Array.isArray(values)&&values.length===expected.length&&values.every((v,i)=>cents(v)===cents(expected[i]));}
 function repairReady(mini,expected){return Boolean(mini.cut&&mini.connectedSource===expected);}
 function featureReady(mini){return Boolean(mini.placed&&mini.wired&&mini.tested);}
 const api={cents,priceReady,repairReady,featureReady};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MiniLogic=api;
})(typeof window==='undefined'?globalThis:window);
