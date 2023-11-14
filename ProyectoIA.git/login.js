var attempt=3;
function validate(){
    var Usuario=document.getElementById("Usuario").value;
    var Password=document.getElementById("Password").value;
    if(Usuario=="Admin"&& Password=="user"){
        
        
        window.location= "Inteligencia.html";
        return false; 

    }if(Usuario=="Admin" && Password=="user"){
        
        window.location="Inteligencia.html";
        return false;
    }
    else{
        attempt--;

}

{
    window.location= "Index.html";
    return false; 
}
}
