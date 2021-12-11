let myForm = document.getElementById('upload_form');

let errorDiv = document.getElementById('error');
var name1 = document.getElementById('bookname')
var price = document.getElementById('price')
var description = document.getElementById('decsription')
var category = document.getElementById('category')

if (myForm) {
    let name3 = name1.value
    let price3 = price.value
    let desc3 =  description.value
    let cat3 = category.value
    myForm.addEventListener('submit', (event) => {
      if (name1.value.trim() && price.value.trim() && description.value.trim() && category.value.trim()) {
        alert("Iffffff")
        if (/\s/.test(name1.value.trim()) || /\s/.test(price.value.trim()) || /\s/.test(description.value.trim()) || /\s/.test(category.value.trim())) {
            name1.value=''
            price.value = '';
            description.value='';
            category.value='';
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Space is not allowed inside username or passsword";
            event.preventDefault();
        }
        else if(description.value.trim().length<600){
            name1.value=name3;
            price.value=price3
            description.value=desc3;
            category.value=cat3;
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Description Should Be Of Atleast 600 Characters Long (Approximately 90 To 150 Words).";
            event.preventDefault();
        }
        else{
            return true;
        }

        myForm.reset();
      } else {
        name1.value='';
        price.value='';
        description.value = '';
        category.value='';
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'You must enter a value';
        textInput.focus();
        event.preventDefault();
      }
    });
  }
  