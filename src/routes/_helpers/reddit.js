const t3 = /^t3_.*$/;
const t1 = /^t1_.*$/;

/**
 * Reddit puts data in different places depending on the type.
 * @param {*} data 
 */
export function extractContent(data) {
  let content = "";
  if(t3.test(data.name)) {
    content = data.title;
  }
  else if(t1.test(data.name)) {
    content = data.body;
  }
  else {
    console.log("No reddit type matcher for name:" + data.name);
  }
  return content;
}