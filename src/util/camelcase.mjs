export const snake2camel = (name, pascal=false) =>{
  const camel = name.replace(/(\-\w)/g, m => m[1].toUpperCase());
  return pascal ? camel.replace(/^\w/g, m => m.toUpperCase()) : camel;
}

export default snake2camel;