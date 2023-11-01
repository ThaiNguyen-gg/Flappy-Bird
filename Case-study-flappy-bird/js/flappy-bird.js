let canvas = document.querySelector('.my_canvas');
let ctx = canvas.getContext('2d');

canvas.height = 710;
canvas.width = 530;

// external img link
const sprites = new Image();
sprites.src = './image-va-audio/flappy-bird-item.png';

// external audio link
const fly = new Audio();
fly.src ='./image-va-audio/wing.mp3';
const point = new Audio() ;
point.src='./image-va-audio/point.mp3';
const hit= new Audio();
hit.src= './image-va-audio/hit.mp3';
const die = new Audio();
die.src= './image-va-audio/die.mp3'


let game = 'start';
let frame = 0; // biến này có tác dụng đếm giờ ( cụ thể là giây) lên đến mỗi  giây nhất định con chim sẽ đập cánh


//  Screen when Start game
const start = {
    draw: function () {
        ctx.beginPath();
        ctx.drawImage(sprites, // vẽ chữ flappy bird
            700,
            175,
            180,
            60,
            canvas.width/2-130,
            50,
            250,
            85)
        ctx.drawImage(sprites,  // vẽ nút play
            580, // tọa độ x cắt hình
            170, // toạ độ y cắt hình
            120, // chiều rộng hình muốn cắt
            112, // chiều dài hình muốn cắt
            canvas.width/2-90, // tọa độ x
            320, //tọa độ y
            170, // chiều rộng của hình trên canvas
            170 ) // chiều dài của hình tren canvas

        ctx.drawImage(sprites,  // vẽ chữ get ready
            590,
            115,
            190,
            65,
            canvas.width/2-140,
            170,
            300,
            70)
    }
}
// Screen when end game
const end = {
    draw: function () {
        ctx.beginPath();
        ctx.drawImage(sprites,780,115,210,65,canvas.width/2-145,170,280,70) // chữ game over
        ctx.drawImage(sprites,5,515,230,130,canvas.width/2-140,270,280,150) // bảng score
        ctx.drawImage(sprites,705,230,120,100,canvas.width/2-60,450,120,100) // nút chơi lại
    }
}
// class background
const bg= {
    sX:295,  // tọa độ X ở hình flappy bird - điểm bắt đầu cắt trục ngang
    sY:0,
    sW:229, // độ rộng của cái ảnh mà bạn muốn cắt
    sH: 400,    // độ dài của cái ảnh mà bạn muốn cắt
    cX:0, // tọa độ x bạn muốn đặt trên canvas ( vì hình nhỏ nên bạn nhìn xuống dưới chúng ta sẽ đặt 3 hình tại x=0, x=229 (0 +sw) và x=458 (229+sw)
    cY:0, // tọa độ y bạn muốn đặt trên canvas
    cW: 229, // chiều rộng mà bạn muốn hiển thị hình ảnh trên canvas ( = với hình ảnh mà bạn cắt ở trên để tránh bể hình - này nó như kéo độ rộng của cái hình mà bạn đã cắt)
    cH: 630, // chiều  dài của hình mà bạn muốn hiển thị trên canvas ( ở đây mình để dài hơn độ dài của hình mà mình đã cắt để kéo dài hình ảnh ra )
    draw: function () {
        ctx.beginPath();
        ctx.drawImage(sprites,this.sX,this.sY,this.sW,this.sH,this.cX,this.cY,this.cW,this.cH)
        ctx.drawImage(sprites,this.sX,this.sY,this.sW,this.sH,this.cX +229,this.cY,this.cW,this.cH)
        ctx.drawImage(sprites,this.sX,this.sY,this.sW,this.sH,this.cX +458,this.cY,this.cW,this.cH)
    }
}
// class Ground ( mặt đất)
function Ground(cX,cY) {
    this.cX=cX; // tọa độ x vẽ trên canvas
    this.cY=cY; // tọa độ y vẽ trên canvas
    this.sX= 585; // tọa độ x cắt hình
    this.sY= 0; // tọa độ y cắt hình
    this.sW = 336; // chiều rộng ảnh cắt
    this.sH = 115; // chiều dài hình cắt
    // this.cW = 250; // chiều rộng của hình ảnh thể hiện trên canvas
    this.cW = 336; // chiều rộng của hình ảnh thể hiện trên canvas
    this.cH = 82; // chiều dài của hình ảnh thể hiện trên canvas
    this.dX = -2;
    this.draw =function () {
        ctx.beginPath();
        ctx.drawImage(sprites,this.sX,this.sY,this.sW,this.sH,this.cX,this.cY,this.cW,this.cH);
    }
}
let arrGround= [];
for (let i=0; i<4; i++) {
    let ground =new Ground(215*i,630);
    arrGround.push(ground);
}
function drawArrGround () { // vẽ mặt đất
    for (let i = 0; i < arrGround.length; i++) {
        arrGround[i].draw();
    }
}
function updateArrGround() {
    for (let i=0; i < arrGround.length; i++) {
        arrGround[i].cX += arrGround[i].dX;
    }
    if(arrGround[0].cX <=-336) { // tức là nó sẽ đi ra ngoài canvas 1 khoảng 336px - phụ thuộc vào chiều rộng cW của đối tượng ground đặt trên canvas
        arrGround.splice(0,1);
        let ground = new Ground(arrGround[2].cX +215,630);
        /* ground ở vị trí đầu là 0 đã bị cắt bây h mảng từ 4 phần tử chỉ còn 3 phần tử và
        vị trí trong mảng cập nhật lại là i[0],i[1],i[2] và i[2].cx +215 sẽ bằng tọa độ x của i[3] cũ và
        push nó lên mảng từ đó ta sẽ chạy được cái sàn */
        arrGround.push(ground);
    }
}

// class Bird
function Bird (cX,cY) {
    this.cX = cX;
    this.cY = cY;
    this.animate = [
        {sX:0,sY:970},
        {sX:56,sY:970}, // cái mảng này sẽ chạy mỗi khi biến frame chia hết cho 35 lúc chưa chơi và 16 lúc đang chơi
        {sX:112,sY:970}
    ]
    this.sW =50;  // độ rộng ảnh muốn cắt
    this.sH =80;  // độ dài ảnh muốn cắt
    this.cW =70; // độ rộng để ảnh trên canvas
    this.cH =120; // độ dài để ảnh trên canvas
    this.i =0;
    this.speed =0;  // vận tốc của chim
    this.a= 0.5;    // gia tốc của chim (accelerate)
    this.draw = function () {
        ctx.beginPath();
        if(game === 'start') {
            if(frame % 35 === 0) {
                this.i++;
                if(this.i > 2) {
                    this.i =0
                }
            }
        }
        if(game === 'play') {
            if(frame% 16 === 0) {
                this.i++;
                if(this.i >2) {
                    this.i =0
                }
            }
        }
      ctx.drawImage(sprites,this.animate[this.i].sX,this.animate[this.i].sY,this.sW,this.sH,this.cX,this.cY,this.cW,this.cH)
    }
    this.update= function () {
        if(game === 'play' || game === 'end' ) {
            this.speed += this.a;
            this.cY += this.speed;

            //Kiểm tra con chim chạm đất: 630 là tọa độ y của nền nhà
            if(this.cY +this.cH + this.speed >=730) { // 630 +120 +speed
                game = 'end';
                this.speed = 0;
                this.cY = 630;
            }
            // Kiểm tra chim chạm cột :
            if( bird1.cX + bird1.cW > arrPipes[0].cX &&
                bird1.cX < arrPipes[0].cX + arrPipes[0].cW &&
                (   bird1.cY < arrPipes[0].cY + arrPipes[0].cH -30 ||
                    // bird1.cY + bird1.cH > arrPipes[0].cY + arrPipes[0].cH  +  arrPipes[0].space
                    bird1.cY + 40 > arrPipes[0].cY + arrPipes[0].cH  +  arrPipes[0].space
                )
            ) {
                game= 'end';
            }
            // Trường hợp ăn điểm
            if(bird1.cX === arrPipes[0].cX +50 || bird1.cX === arrPipes[0].cX +51) {
                score.value++;
                point.play();
                maxScore.value = Math.max(score.value,maxScore.value);
            }
        }
    }
}
let bird1 = new Bird(150, canvas.height/2-50);

// class Medal
function Medal (i) {
    this.sX =[235,235,218];
    // this.sX=235;
    this.sY = [515,563,955];
    this.sW=50;
    this.sH=45;
    this.cX=canvas.width/2-109;
    this.cY= 325;
    this.cW=50;
    this.cH=45;
    this.i = i; //0 là bạc, 1 là vàng, 2 là đồng
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(sprites,this.sX[this.i],this.sY[this.i], this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }
    this.update = function () {
        if(score.value === 0) {
            this.i = 2;
        }
        if(score.value === maxScore.value) {
            this.i = 1;
        } else if (score.value >= maxScore.value / 2 && score.value < maxScore.value) {
            this.i = 0;
        } else {
            this.i = 2;
        }
    }
}
let medal = new Medal(0);
// class pipe (ống)
function Pipe(cX,cY,space) {
    this.cX = cX;   // tọa độ x đặt để vẽ trên canvas
    this.cY = cY;   // tọa độ y đặt để vẽ trên canvas
    this.cW= 58;       // chiều rộng của hình trên canvas
    this.cH= 600;       // chiều dài của hình trên canvas
    this.space= space;
    this.sXt =110;     //tọa độ x của đường ống ở trên
    this.sYt =645;     // tọa độ y của đường ống ở trên

    this.sXb =165;     // tọa độ x của đường ống ở dưới
    this.sYb =645;     // tọa đọ y của đường ống ở dưới

    this.sW = 58;      // chiều rộng của ảnh trong sprite
    this.sH = 330;      // chiều dài của ảnh trong sprite
    this.dX = -2;   // tốc độ của đường ống - như cái nền dưới đất
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(sprites, this.sXt,this.sYt,this.sW,this.sH,this.cX,this.cY,this.cW,this.cH);
        ctx.drawImage(sprites, this.sXb,this.sYb,this.sW,this.sH,this.cX, this.cY + this.cH + this.space ,this.cW,this.cH);
    }
}
// tạo độ dài ngẫu nhiên cho cột:
function randomPipe(min,max) {
    return Math.ceil(Math.random()* (max-min) +min);
}

let arrPipes = []; // tạo 1 mảng, trong mảng tạo từng đối tượng , và vẽ

function newPipes () {
    for (let i=1; i<4; i++) {
        let pipe =new Pipe(randomPipe(530,600) * i, randomPipe(-650,-120),200);
        // let pipe =new Pipe(randomPipe(530,600) * i, randomPipe(-600,-100),550);
        arrPipes.push(pipe);
    }
}
newPipes ();
function drawArrPipes () { // vẽ cột
    for (let i = 0; i < arrPipes.length; i++) {
        arrPipes[i].draw();
    }
}
function updateArrPipes() {
    for (let i=0; i < arrPipes.length; i++) {
        arrPipes[i].cX += arrPipes[i].dX;
    }
    if(arrPipes[0].cX <=-58) { // tức là nó sẽ đi ra ngoài canvas 1 khoảng 82px
        arrPipes.splice(0,1);
        // let pipe = new Pipe(arrPipes[arrPipes.length-1].cX + randomPipe(400,500), randomPipe(-600,-100), randomPipe(500,400));
        let pipe = new Pipe(arrPipes[arrPipes.length-1].cX + randomPipe(400,500), randomPipe(-650,-120), randomPipe(200,180));
        arrPipes.push(pipe);
    }
}

// class Score
const arrNumber = [
    {name: 0, sX:985, sY:120, sW:270, sH:45, cW:600 ,cH:100},
    {name: 1, sX:270, sY:910, sW:300, sH:43.5,cW:600, cH:100},
    {name: 2, sX:585, sY:320, sW:25, sH:45, cW:50, cH:100},
    {name: 3, sX:610, sY:320, sW:25, sH:45, cW:50, cH:100},
    {name: 4, sX:640, sY:320, sW:25, sH:45, cW:50, cH:100},
    {name: 5, sX:665, sY:320, sW:25, sH:45, cW:50, cH:100},
    {name: 6, sX:583, sY:368, sW:25, sH:43.5, cW:50, cH:100},
    {name: 7, sX:610, sY:368, sW:25, sH:43.5, cW:50, cH:100},
    {name: 8, sX:640, sY:368, sW:25, sH:45, cW:50, cH:100},
    {name: 9, sX:665, sY:368, sW:25, sH:45, cW:50, cH:100},
];
function Score(value,cX,cY) {
    this.value = value;
    this.cX= cX;
    this.cY= cY;
    this.draw = function () {
        ctx.beginPath();
        if(this.value >= 10 ) {
            this.split = (this.value.toString()).split('');
            for(let i=0; i < arrNumber.length; i++ ) {
                if(this.split[0] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH,canvas.width/2-52, 60,
                        arrNumber[i].cW,arrNumber[i].cH)
                }
                if(this.split[1] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH, canvas.width/2 , 60,
                        arrNumber[i].cW,arrNumber[i].cH)
                }
            }
        }
        else {
            this.split = this.value.toString();
            for(let i=0; i< arrNumber.length; i++) {
                if(this.split[0] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH,canvas.width/2 -30, 60,
                        arrNumber[i].cW,arrNumber[i].cH)
                }
            }

        }
    }
    this.drawSmall = function () {
        ctx.beginPath();
        if(this.value >= 10 ) {
            this.split = (this.value.toString()).split('');
            for(let i=0; i < arrNumber.length; i++ ) {
                if(this.split[0] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH, this.cX + 15, this.cY,
                        arrNumber[i].cW/3,arrNumber[i].cH/3)
                }
                if(this.split[1] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH, this.cX + 35 , this.cY,
                        arrNumber[i].cW/3,arrNumber[i].cH/3)
                }
            }
        }
        else {
            this.split = this.value.toString();
            for(let i=0; i< arrNumber.length; i++) {
                if(this.split[0] == arrNumber[i].name) {
                    ctx.drawImage(sprites,arrNumber[i].sX,arrNumber[i].sY,arrNumber[i].sW,arrNumber[i].sH, this.cX + 18, this.cY,
                        arrNumber[i].cW/3,arrNumber[i].cH/3)
                }
            }

        }
    }
}


let score = new Score(0,320,310);
let maxScore = new Score(0,324,360);

let cx = document.getElementById("myCanvas");

cx.addEventListener('click', playGame); // hàm này để sự kiện click
document.addEventListener('keydown', playGame); // hàm này cho sự kiện ấn


function playGame(event) {
    switch (game) {
        case 'start':
            game ='play';
            break;
        case 'play':
            console.log('Chơi game');
            bird1.speed = -8;
            fly.play();
            break;
        case 'end' :
            console.log('End game');
            if(
                event.offsetX > canvas.width / 2 - 60 &&
                event.offsetX < canvas.width / 2 + 60 &&
                event.offsetY > 450 &&
                event.offsetY < 550
            ) {
                console.log(event.offsetX);
                score.value = 0;
                arrPipes = [];
                newPipes ();
                bird1.speed =0;
                bird1.cY = canvas.height/2-50;
                game = "start";
            }
            break;
    }
}


function draw() { // hàm gọi hàm vẽ background game , nút play, chữ get ready , nền, chim lúc đầu
    bg.draw();
    if(game ==="start") {
        start.draw();
    }
    drawArrPipes();
    drawArrGround();
    if(game === "play") {
        score.draw();
    }
    // nếu bạn đặt dòng drawArrPipes(); ở ngay đây thì điểm của bạn sẽ bị cột đè lên trên
    bird1.draw();
    if(game === "end") {
        end.draw();
        score.drawSmall();
        maxScore.drawSmall();
        medal.draw();
    }
}

function update() {   // hàm sau khi chuyển từ trạng thái start thành play
    if(game === "play") {
        updateArrPipes();
        updateArrGround();
    }
    bird1.update();
    medal.update();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    frame++;
    draw();
    update();
}

animate();




