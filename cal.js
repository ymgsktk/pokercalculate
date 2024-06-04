let playerCount = 0;

document.getElementById('add-button').addEventListener('click', () => {
    const playerName = document.querySelector('.name').value;
    playerCount++;
    addPlayerFields(playerCount,playerName);
});

window.addEventListener('load', () => {
    // ページがロードされたときにローカルストレージからデータを読み込み
    const keys = Object.keys(localStorage).filter(key => key.startsWith('player__'));
    keys.forEach(key => {
        const match = key.match(/^player__(\d+)__(.+)$/);
            const playerNumber = match[1];
            const playerName = match[2];
        console.log(playerNumber,playerName)
        addPlayerFields(playerNumber, playerName,JSON.parse(localStorage.getItem(key)));
    });
});

function addPlayerFields(playerNumber, playerName, savedData = [[], []]) {
    if(!playerName){
        alert("ユーザー名を入力してください")
        return;
    }else{
    const nameInput = document.querySelector('.name');
    nameInput.value = '';
    const container = document.getElementById('input-container');

    const margin = document.createElement('div');
    margin.className = "margin"
    container.appendChild(margin)

    const playerparent = document.createElement('div');
    playerparent.className = "flex-container";
    playerparent.id = playerNumber

    const name = document.createElement('h2');
    name.textContent = `${playerName}`
    name.className="flex-container";
    container.appendChild(name)
    container.appendChild(margin)
    
    const inputGroup1 = createInputGroup(playerNumber, 1, savedData[0]);
    const inputGroup2 = createInputGroup(playerNumber, 2, savedData[1]);
    
    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'arrow';
    arrowDiv.textContent = '➡';
    
    
    playerparent.appendChild(inputGroup1); // 1つ目の入力フィールドグループを追加
    playerparent.appendChild(arrowDiv); // 矢印を追加
    playerparent.appendChild(inputGroup2); // 2つ目の入力フィールドグループを追加
    
    const saveButton = document.createElement('button');
    saveButton.textContent = '計算';
    saveButton.onclick = () => savePlayerData(playerNumber,playerName);
    playerparent.appendChild(saveButton);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    playerparent.appendChild(deleteButton);
    container.appendChild(playerparent); // playerparentをコンテナに追加
    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", "box1");
    newDiv.setAttribute("class", "flex-container-center");

    newDiv.innerHTML = `
        <p>今回の収益<br><span id = "winpoint-${playerNumber}""></p>
        <p>現在までの収益<br><span id = "winpoint2-${playerNumber}"></p>
    `;
    container.appendChild(newDiv)
    deleteButton.onclick = () => deletePlayerData(playerNumber, playerName,newDiv,name);
    }
}

function createInputGroup(playerNumber, groupNumber, savedData = []) {
    const inputContainer = document.createElement('div');
    inputContainer.className = "input-containers";
    inputContainer.id = `player${playerNumber}-group${groupNumber}`;
    let count = 0
    for (let i = 1; i <= 5; i++) {
        const inputparent = document.createElement('div');
        const imgparent = document.createElement('img')
        imgparent.id = "mini-tip"
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = `10`;
        if (savedData[i - 1]) {
            input.value = savedData[i - 1];
        }
        switch(count){
            case 0: 
                const newText2 = document.createTextNode('究極：');
                inputparent.appendChild(newText2);
                imgparent.src = "黒チップ.png";
                break;
            case 1: 
                const newText3 = document.createTextNode('最高：');
                inputparent.appendChild(newText3);
                imgparent.src = "青チップ.png";
                break;
            case 2: 
                const newText4 = document.createTextNode('高級：');
                inputparent.appendChild(newText4);
                imgparent.src = "黄チップ.png";
                break;
            case 3: 
                const newText5 = document.createTextNode('上質：');
                inputparent.appendChild(newText5);
                imgparent.src = "赤チップ.png";
                break;
            case 4: 
                const newText6 = document.createTextNode('一般：');
                inputparent.appendChild(newText6);
                imgparent.src = "赤チップ.png";
                break;
        }
        const newText = document.createTextNode('枚');
       // inputparent.appendChild(imgparent)   
        inputparent.appendChild(input);
        inputparent.appendChild(newText);
        inputContainer.appendChild(inputparent); 
        
        count++;
    }
    
    return inputContainer;
}

function savePlayerData(playerNumber,playerName) {
    const playerDivs = document.querySelectorAll(`[id^=player${playerNumber}-group]`);
    const data = [];
    
    playerDivs.forEach(playerDiv => {
        const inputs = playerDiv.getElementsByTagName('input');
        const groupData = [];
        for (let input of inputs) {
            groupData.push(input.value);
        }
        data.push(groupData);
    });
    
    localStorage.setItem(`player__${playerNumber}__${playerName}`, JSON.stringify(data));
   // alert(`Player ${playerNumber}のデータが保存されました`);
    calculate(playerNumber,playerName);
    
    let playervalue = JSON.parse(localStorage.getItem(`${playerName}result`));
    let playerresult2 = JSON.parse(localStorage.getItem(`${playerName}result2`));
    let sum = 0
    for (let value of playerresult2) {
        sum += value;
    }
    const win = document.getElementById(`winpoint-${playerNumber}`)
    const win2 = document.getElementById(`winpoint2-${playerNumber}`)

    var resultTextNode = document.createTextNode(playervalue);
    var resultTextNode2 = document.createTextNode(sum);
    while (win.firstChild) {
        win.removeChild(win.firstChild);
    }
    while (win2.firstChild) {
        win2.removeChild(win2.firstChild);
    }
    win.appendChild(resultTextNode)
    win2.appendChild(resultTextNode2)

}
function deletePlayerData(playerNumber,playerName,newDiv,name) {
    localStorage.removeItem(`player__${playerNumber}__${playerName}`);
    localStorage.removeItem(`${playerName}result`)
    localStorage.removeItem(`${playerName}result2`)
  //  alert(`Player ${playerNumber}のデータが削除されました`);
    //location.reload();
    const container = document.getElementById('input-container');
    const playerParent = document.getElementById(playerNumber);
    container.removeChild(playerParent);
    container.removeChild(name)
    newDiv.parentNode.removeChild(newDiv);
}

function calculate(playerNumber,playerName){
    let playervalue = JSON.parse(localStorage.getItem(`player__${playerNumber}__${playerName}`)); //playervalueに計算したいプレーヤーのtip枚数が保存されている
    //console.log(playervalue,playerName)

    var inputElements = document.querySelectorAll('.tip'); //一番最初に設定されたtipの値段
   // console.log(inputElements)
    // 各input要素の値を取得して配列に保存
    var inputValues = [];
    inputElements.forEach(function(inputElement) {
        inputValues.push(parseFloat(inputElement.value));
    });
    let tip = 0
    for (let j = 0 ; j < 5; j++){
        let tip1 = (parseFloat(playervalue[1][j]) - parseFloat(playervalue[0][j]))*inputValues[j]
        tip = tip + tip1
        //console.log(tip)
    }
    calculateresult(playerName,tip)
}
function calculateresult(playerName,tip){
    localStorage.setItem(`${playerName}result`, JSON.stringify(tip));
    let value = localStorage.getItem(`${playerName}result2`);
    
    // 値が存在しない場合、または空の場合に初期値を設定
    if (!value || value === 'undefined') {
        value = [tip]
    } else{
        value = JSON.parse(value);
        value.push(tip)
    }
    localStorage.setItem(`${playerName}result2`, JSON.stringify(value));
}


//モーダル表示
$(".modaal-open").modaal({
overlay_close:true,//モーダル背景クリック時に閉じるか

before_open:function(){
    $('html').css('overflow-y','scroll');
},/*
after_close:function(){
    $('html').css('overflow-y','scroll');
}*/
});