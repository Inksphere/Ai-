let extractedText="";
let answers=[];

// PDF TEXT EXTRACTION
async function extractPDF(){
 const file=document.getElementById('pdfFile').files[0];
 const reader=new FileReader();
 reader.onload=async function(){
  const pdf=await pdfjsLib.getDocument(new Uint8Array(this.result)).promise;
  extractedText="";
  for(let i=1;i<=pdf.numPages;i++){
   const page=await pdf.getPage(i);
   const content=await page.getTextContent();
   content.items.forEach(t=>extractedText+=t.str+" ");
  }
  document.getElementById('pdfText').value=extractedText;
 };
 reader.readAsArrayBuffer(file);
}

// Q → A PARSER
function parseQA(){
 answers=[];
 extractedText.split("\n").forEach(l=>{
  if(l.includes("A:")){
   answers.push(l.replace("A:","").trim());
  }
 });
 document.getElementById('answers').innerHTML=
  answers.map(a=>`<div>✔ ${a}</div>`).join("");
}

// SEND TO GOOGLE SHEETS
function sendToSheet(){
 fetch("YOUR_APPS_SCRIPT_URL",{
  method:"POST",
  body:JSON.stringify({answers}),
  headers:{'Content-Type':'application/json'}
 });
 alert("Sent to Google Sheets");
}
