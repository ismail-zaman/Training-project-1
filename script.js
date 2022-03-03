
const variables={
}

const specVariables={
    "e": 2.7182,
    "Π": 3.1514
}
const op={
    "+":1,
    "-":1,
    "*":2,
    "/":2,
    "^":3,
    "√":3,
    "sin":3,
    "cos":3,
    "tan":3
}


const resultHistory = []




const expressionChecks= {
    "bracketCheck": (seperatedExp)=>{
        const stack = []
        
        for(x of seperatedExp){
            if(x === '('){
                stack.push(x)
            }
            if(x === ')'){
                stack.pop()
            }
        }
        return stack.length === 0
    },

    "variableCheck": (seperatedExp)=>{

        for(x of seperatedExp){
            if(isNaN(x) && !op.hasOwnProperty(x)){
                return false
            }
        }
        return true
    }
}



const opFunction={
    "+": (num1,num2)=>parseFloat(num1) + parseFloat(num2),
    "-": (num1,num2)=>{
        if(parseFloat(num2) < parseFloat(num1)){
            return -(parseFloat(num1) - parseFloat(num2))
        }else{
            return (parseFloat(num2) - parseFloat(num1))
        }
        
    
    },
    "*": (num1,num2)=>parseFloat(num1) * parseFloat(num2),
    "^": (num1,num2)=>Math.pow(num2,num1),
    "/": (num1,num2)=>parseFloat(num2) / parseFloat(num1),
    "√": (num1) => Math.sqrt(parseFloat(num1)),
    "sin":(num1) => Math.sin(num1),
    "cos":(num1) =>Math.cos(num1),
    "tan":(num1) =>Math.tan(num1)
    
}



const variables_view = document.querySelector('.variables')



//Input box 
const inputBox = document.querySelector("#text-box")

//Adding event listeners to the buttons. 
const buttons = document.querySelectorAll(".op-button")
let add = true
for(let i =0; i< buttons.length; i++){
    add= true
    buttons[i].addEventListener("click", function(event){
        if(event.currentTarget.value ==="="){
            add = false
        }
        if(event.currentTarget.value === "clear"){
            inputBox.value = ""
            add=false
        }
        if(add){
            if(event.currentTarget.value === "sin" || event.currentTarget.value === "cos" || event.currentTarget.value === "tan"){
                inputBox.value =inputBox.value +event.currentTarget.value + "("
            }else{
                inputBox.value =inputBox.value + event.currentTarget.value
            }
        }

    })
}


//Keypress events
window.addEventListener('keydown', (event)=>{
    if(event.keyCode === 32 && event.target === document.body) {
        event.preventDefault();
    }
})


document.querySelector('#text-box').addEventListener("keydown", (event)=>{

    if(event.keyCode === 32 && event.target == document.body) {
        event.preventDefault();
    }
    

    if(event.key === "Backspace"){
        if(inputBox.value[inputBox.value.length-1] === "n" || inputBox.value[inputBox.value.length-1] === "s"){
            inputBox.value = inputBox.value.slice(0,-3)
        }
        inputBox.value = inputBox.value.slice(0,-1)
    }else{
        if(event.key !=='Shift' && event.key!=='Alt' && event.key !== 'Control'){
            inputBox.value = inputBox.value + event.key
        }
        
    }
    
})


const variable_submit_button = document.querySelector('#variable-submission')
variable_submit_button.addEventListener('click',addVariable)


//variables stored here





//create new variable element
function createNewVariableBlock(variable_name, variable_value){
    let variableBlock = document.createElement('div')
    variables_view.appendChild(variableBlock)
    variableBlock.textContent= variable_name + ": " + variable_value
    variableBlock.className = 'variable-pair'

}



//Adds a new variable 

function addVariable(e){
    
    const variable = document.querySelector("#variable")
    const variable_value = document.querySelector('#variable-value')

    if(isValidVariable(variable, variable_value)){
        variables[variable.value] = variable_value.value
        createNewVariableBlock(variable.value, variable_value.value);
        variable.value = ""
        variable_value.value = ""
    }
    

}





//Checks if the variable values are valid
function isValidVariable(variable, variable_value){
    if(!isNaN(variable.value[0]) || isNaN(variable_value.value)){
        return false
    }
    if(variable.value === "sin" || variable.value === "cos" ||variable.value === "tan" ||variable.value === "e"){
        return false
    }
    if(variables.hasOwnProperty(variable.value)){
        return false
    }
    return true
}


//Reading the input string

document.querySelector('.submit-button').addEventListener('click',processInput)





function replaceVariables(inputString){
   

    for(key in variables){
    

        if(key !=="e"){
            let indexOfVar = inputString.indexOf(key)
            while(indexOfVar!==-1){
                
                if(indexOfVar ===0 && key.length === inputString.length){
    
                    inputString = variables[key]
                }else{
                    inputString = inputString.slice(0,indexOfVar) + variables[key] + inputString.slice(indexOfVar + key.length, inputString.length)
                }
                
    
    
                indexOfVar = inputString.indexOf(key)
            }
        }
    }
    

    for (x in specVariables){

        let index = inputString.indexOf(x)

        while(index != -1){
            if(index === 0 && inputString.length === 1){
                inputString = specVariables[x]
            }else{
                inputString = inputString.slice(0,index) + specVariables[x] +inputString.slice(index+ x.length, inputString.length)


            }
            index = inputString.indexOf(x)
        }

    }




    return inputString
}


function convertToPostfix(infix){
    const stack = []
    const expression = addMultiply(seperateValues(infix))
    
    //Seperated values array contains all the values and operators in the expression. 
    stack.push("(")
    expression.push(")")
    const postfix = []
    let index = 0 
    let count = 0
    let top = ""
    
    while(stack.length !== 0 && index < expression.length){

        if(!isNaN(expression[index])){
            postfix.push(expression[index])
            index +=1
            
            continue
        }

        if(expression[index] === "("){
            stack.push("(")
            index +=1
            continue
        }


        
        if(op.hasOwnProperty(expression[index])){
            


            top = stack[stack.length-1]
            while(op[expression[index]]  <= op[top] && top != "("){
                top = stack[stack.length-1]
                if(top === "("){
                    break
                }
                postfix.push(stack.pop())
            }
            
            stack.push(expression[index])
            
            index+=1
            continue
        }

        if(expression[index] ===")"){
            top = stack[stack.length-1]
            while(top != "("){
                top = stack[stack.length-1]
                if(top ==="("){
                    break
                }

                postfix.push(stack.pop())
            }
            stack.pop()
            index+=1
            continue
        }




        

        count +=1
        if(count > 100){
            break
        }

    } 

    console.log(stack)
    console.log(postfix)

    return postfix
}



function seperateValues(infix){

    const seperatedValues = []
    temp = ""
    
    for(let i =0; i<infix.length;i++){

        if(op.hasOwnProperty(infix[i]) || infix[i] === "(" || infix[i] === ")"){
            if(temp !== ""){
                seperatedValues.push(temp)
                temp = ""

            }
            seperatedValues.push(infix[i])
            continue
        }
        temp += infix[i]
    }


    if(temp !== ""){
        seperatedValues.push(temp)
    }

    
    return seperatedValues
}


function evaluateExp(postfix){
    let stack = []

    let index = 0

    

    for(x of postfix){
        if(!isNaN(x)){
            stack.push(x)
            continue
        }
        if(op.hasOwnProperty(x)){
            let result = 0
            if(x === "√" || x ==="sin" || x ==="cos" || x==="tan"){
                let num1 = stack.pop()
                result = opFunction[x](num1)

            }else{

                let num1 = stack.pop()
                let num2 = stack.pop()
                result = opFunction[x](num1,num2)
            }
            
            stack.push(result)
        }
    }

    return stack[0]

}


function addMultiply(seperatedExp){
    temp = []

    for(let i=0;i<seperatedExp.length;i++){

        



        if(!isNaN(seperatedExp[i])){
            if(i !== seperatedExp.length -1){
                if(seperatedExp[i+1] === "("){
                    temp.push(seperatedExp[i])
                    temp.push("*")
                    
                    continue
                }
            }
        }
        if(i !== seperatedExp.length -1){
            if(seperatedExp[i] === ")" && seperatedExp[i+1] ==="(" || seperatedExp[i] === ")" && !isNaN(seperatedExp[i+1])){
                temp.push(")")
                temp.push("*")
                continue
            }
        }
        temp.push(seperatedExp[i])
    }
    return temp
}


function isFloat(x) { return !!(x % 1); }

function displayResults(result,type="error"){
    const historyElement = document.createElement("div")


    if(type === "answer"){
        historyElement.setAttribute("style","display: flex; justify-content: center; align-items:center;")



        const resultValue = document.createElement("button")
        resultValue.setAttribute("style", "height: 30px;")
        resultValue.textContent = result
        resultValue.addEventListener('click', (e)=>{
            inputBox.value += e.currentTarget.textContent
        })


        const resultType = document.createElement("h5")
        resultType.textContent = "Answer: "
        resultType.setAttribute("style", "margin-right: 20px;")
        historyElement.appendChild(resultType)
        historyElement.appendChild(resultValue)
        historyElement.setAttribute("class","result")
        resultHistory.push(historyElement)

    }else{
        
        const resultType = document.createElement("h5")
        resultType.textContent = result
        historyElement.appendChild(resultType)
        resultHistory.push(historyElement)

    }
    
    inputBox.insertAdjacentElement("afterend",historyElement)
}

function removeErrors(){
    for(x of resultHistory){
        if(!x.hasAttribute("class")){
            x.remove()
        }
    }
}

function processInput(e){


    removeErrors()
    let inputString = inputBox.value
    

    inputString = replaceVariables(inputString)
    try{
        const expArray = seperateValues(inputString)
        let check1 = expressionChecks.bracketCheck(expArray)
        if(!check1){
            throw new Error("Bracket mismatch. Did you miss a bracket ?")
            
        }
        

    }catch(e){
        displayResults(e)
        return
    }



    console.log(inputString)


    let postfixExp = convertToPostfix(inputString)
    let answer = evaluateExp(postfixExp)

    try{
        if(!answer){
            throw new Error("Syntax Error")
        }
        if(isFloat(answer)){
            answer = answer.toFixed(4)
        }



        displayResults(answer,"answer")
    }catch(e){
        displayResults(e)
        return
    }
}
