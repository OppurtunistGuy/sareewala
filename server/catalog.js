// Demo inventory only. Replace with merchant-approved data before live commerce.
const styles = [
  [1,'Rose Pink Satin Silk Saree','rose','Silk Sarees','Rose pink',699,1999,90],
  [2,'Emerald Green Woven Silk Saree','green','Silk Sarees','Emerald green',899,2499,85],
  [3,'Sunshine Yellow Printed Saree','yellow','Everyday Sarees','Sunshine yellow',599,1799,70],
  [4,'Royal Purple Banarasi Silk Saree','purple','Festive Sarees','Royal purple',999,2999,100],
  [5,'Coral Peach Soft Silk Saree','coral','Silk Sarees','Coral peach',749,2199,50],
  [6,'Ocean Blue Printed Saree','blue','Everyday Sarees','Ocean blue',649,1899,65],
  [7,'Wine Gold Festive Saree','wine','Festive Sarees','Wine',1199,3299,80],
  [8,'Mint Green Floral Saree','mint','Everyday Sarees','Mint green',799,2299,75],
];
export const catalog = styles.map(([id,name,image,collection,color,price,mrp,popularity])=>({
 id,name,image,images:[image],category:'Women',collection,color,price:price*100,mrp:mrp*100,popularity,
 createdAt:`2026-10-${String(id).padStart(2,'0')}`,demo:true,returnable:id!==7,
 description:'A saree look inspired by traditional Indian drapes. This is a sample catalogue item for testing the shopping experience; availability and specifications are not merchant-approved.',
 fabric:collection==='Silk Sarees'?'Silk-style fabric (demo specification)':'Woven fabric (demo specification)',
 care:'Demo care guidance: gentle professional cleaning. Confirm the actual garment label before cleaning.',
 size:'Free size: sample 5.5 m saree + 0.8 m blouse piece',
 variants:[{id:`${id}-standard`,color,size:'Free size',stock:12,label:'Standard drape'}, {id:`${id}-premium`,color,size:'Free size',stock:0,label:'Premium finish'}],
}));
export const demoCoupon={code:'WELCOME10',percent:10,maxDiscount:30000,minSubtotal:49900,expires:'2030-12-31T23:59:59Z',perUserLimit:1,stackable:false};
