let myForm = document.getElementById('customer-signup-form');

let errorDiv = document.getElementById('error');
var name1 = document.getElementById('cust')
var username = document.getElementById('username')
var password = document.getElementById('password')

if (myForm) {
    let name3 = name1.value
    let un = username.value
    myForm.addEventListener('submit', (event) => {
      if (username.value.trim() && password.value.trim()) {
        //alert("Iffffff")
        if (/\s/.test(name1.value.trim()) || /\s/.test(username.value.trim()) || /\s/.test(password.value.trim())) {
            name1.value=''
            username.value = '';
            password.value='';
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Space is not allowed inside username or passsword";
            event.preventDefault();
        }
        else if(password.value.trim().length<6){
            name1.value=name1.value;
            username.value=username.value;
            password.value='';
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Password Should Be Of Atleast 6 Characters Long.";
            event.preventDefault();
        }
        else if(username.value.trim().length<4){
            name1.value=name1.value;
            username.value='';
            password.value='';
            errorDiv.hidden = false;
            errorDiv.innerHTML = "Username Should Be Of Atleast 4 Characters Long.";
            event.preventDefault();
        }
        else{
            return true;
        }

        // myForm.reset();
      } else {
        name1.value=''
        username.value = '';
        password.value='';
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'You must enter a value';
        textInput.focus();
        event.preventDefault();
      }
    });
  }
  