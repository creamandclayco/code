// COLLECTION DYNAMIC BREADCRUMB
    
var collectionPage = document.querySelector("[active-collection]");
    
if (collectionPage){

  let col_activeCollection = document.querySelector("[active-collection]");
  col_activeCollection = col_activeCollection.getAttribute("active-collection");
  
  if (col_activeCollection){
    let col_collectionItems = document.querySelectorAll("[collection]");
    col_collectionItems.forEach( item => {
      if (item.getAttribute("collection") === col_activeCollection){
        item.style.display = "block"
      }
    })
  }

  var activeCollectionOnCollectionPage = collectionPage.getAttribute("active-collection");  
  window.setTimeout(() => {
    var itemLinks = document.querySelectorAll(".collection-item-link");
    itemLinks.forEach( item => {
      item.href = item.href + `?from-collection=${activeCollectionOnCollectionPage}`
    })

  }, 200)
      
  
}


