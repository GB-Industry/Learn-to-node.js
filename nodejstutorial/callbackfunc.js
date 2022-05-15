var c = function(){
  console.log('C');
}
function slowfunc(callback){
  callback();
}
slowfunc(c);
console.log('A');
console.log('B');
