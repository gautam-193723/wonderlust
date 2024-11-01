
let taxswitch=document.getElementById("flexSwitchCheckDefault");
taxswitch.addEventListener("click", () =>{

    console.log("ckck")
    let taxinfo=document.getElementsByClassName("tax-info");
    for(info of taxinfo){
        if(info.style.display !="inline"){
            info.style.display="inline"
        }else{
            info.style.display="none"
        }
    }
})

