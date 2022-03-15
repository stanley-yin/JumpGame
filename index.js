// TODO
// 1. 開始後的倒數計時 V
// 2. 計分 V
// 3. 金幣加分 V
// 4. 射出子彈
// 5. 生命系統(三條命)
// 6. 雙重跳躍
// 7. 優化角色圖案 V
// 7.1 能夠以正確邊界為判斷
// 8. 隨機石頭高度、速度 V
// 9. 右邊計分板
// 10.優化物體碰撞動畫

// 排行榜
const renderList = () => {
  const myScoreList = document.querySelector(".score-list");
  fetch("http://54.249.155.240:3005/get-score", { method: "get" })
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
      // 排序名次
      let sortList = [];

      response.sort((a, b) => {
        return b.score - a.score;
      });
      myScoreList.innerHTML = ''

      // render上排行榜
      response.forEach((el, index) => {
        if (index < 10) {
          const newList = document.createElement("li");
          const text = document.createTextNode(
            `${index + 1}----${el.player_name} : ${el.score}`
          );
          newList.appendChild(text);
          myScoreList.appendChild(newList);
        } else {
          return;
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
};
renderList();

let countTime = 3;
const time = document.getElementById("time");

let playing = false;
let CountTimer;
let coinTimer;

// 計數器
const timer = () => {
  CountTimer = setInterval("Count()", 1000);
};

// 開始倒數計時
function Count() {
  if (countTime === 0) {
    window.clearInterval(CountTimer);
    $(".time").css("display", "none");
    $(".stone").css("height", "50px").addClass("move");
    $(".move").css("animation-duration", "2s");
    $(".coin").addClass("coinMove");
    i = 3;
    return;
  }
  console.log(countTime);
  time.innerText = countTime;
  countTime--;
}

// 開始遊戲
const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener("click", () => {
  $("button").css("display", "none");
  $(".time").css("display", "block");
  playing = true;
  // 3秒後開始
  timer();
});

// 讓角色跳躍
$(window).on("keydown", function () {
  $(".stanley")
    .addClass("jump")
    .one("animationend", function () {
      $(this).removeClass("jump");
    });
});

let score = 0;
let stanleyBottom;
let stanleyHead = stanleyBottom + 100;
let stanleyRight;
let stoneRight;
let stoneHeight;
let coinBottom;
let distance = stanleyRight - stoneRight;
let now = new Date();
const form  = document.querySelector('form')

const sendScore = () => {
  const url = "http://54.249.155.240:3005/input-score";
  const nameEl = document.querySelector('#name')

  let data = {
    player_name: nameEl.value,
    score: score,
  };

  $.ajax({
    url: url,
    method: "POST",
    dataType: "x-www-form-urlencoded",
    data: data,
  });

  alert('成功紀錄')
  score = 0;
  form.style.display = 'none'

};

// 判斷是否死亡
setInterval(() => {
  // 角色、石頭的距離資料
  stanleyBottom = parseInt($(".stanley").css("bottom"));
  stanleyRight = parseInt($(".stanley").css("right"));
  stoneRight = parseInt($(".stone").css("right"));
  stoneHeight = parseInt($(".stone").css("height"));
  coinBottom = parseInt($(".coin").css("bottom"));
  coinRight = parseInt($(".coin").css("right"));
  // console.log(coinBottom)
  distance = stanleyRight - stoneRight;

  // 石頭左邊碰到就出局
  if (stanleyBottom <= stoneHeight && distance <= 50) {
    // 打開名字表單
    const yourScore  = document.querySelector('.yourScore')
    yourScore.innerText = `逃跑距離:${score}`
    form.style.display = 'block'

    // 解決為什麼fetch會失敗的問題
    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         // 'Accept': 'application/json'
    //     },
    //     body:data
    // })

    $(".stone").removeClass("move");
    $("button").attr("disabled", false);
    $(".score").text(score);
    $("button").css("display", "block");
    $(".coin").remove();
  }
}, 10);

// 加分顯示
function addScore() {
  $(".score").text(score);
}

// 計分系統
const scroeSystem = setInterval(() => {
  // 如果距離小於0(跳過了石頭)
  if (distance < 0) {
    score += 1;
    console.log(score);
    addScore();
  }
  // 撞到金幣
  if (stanleyBottom + 100 >= coinBottom && stanleyRight - coinRight < 0) {
    score += 10;
    addScore();

    // 金幣移除
    $(".coin").remove();
    cointTimer = setTimeout(() => {
      $(".box").append('<div class="coin"></div>');
      $(".coin").addClass("coinMove");
      console.log("new");
    }, 5000);
  }
}, 100);

// 改變每顆石頭的數據
setInterval(() => {
  // 如果過了接近尾部就執行
  if (stoneRight >= 980) {
    // 把舊石頭移除
    $(".stone").remove();

    // 設置隨機的時間
    let randomTime = Math.random() + 1.5;
    let randomHeight = Math.random() * 80;
    console.log(randomTime);

    // 增加新的石頭
    $(".box").append('<div class="stone move"></div>');

    // 因為需要先有stone，不然move會undiefined
    $(".move").css("animation-duration", `${randomTime}s`);
    $(".stone").css("height", `${randomHeight}px`);

    console.log($(".move").css("animation-duration"));
    console.log($(".stone").css("height"));
  }
}, 10);
