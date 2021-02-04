let timer = null;
let timerArr = [];
let counter = 0;
let userId = "";
let allSuccessNum = 0; //当前成功票数
let alloverNum = 0; //当前失败票数

// 循环ip,发送请求
function forVote() {
  let timeDate = formatDate();
  let cyclesLength = cyclesNumGen();

  for (let i = 0; i < cyclesLength; i++) {
    let item = ipGen();
    let baseItem = {
      fullname: stringGen("name", 6) + " " + stringGen("name", 8),
      phone: phoneNumGen(),
      email: emailGen(),
      province_id: provinceGen(),
      ip: ipGen(),
      vote: [
        {
          award_id: 14,
          contender_id: 64, // bk
        },
        {
          award_id: 15,
          contender_id: numberGen(69, 73), // k2
        },
        {
          award_id: 16,
          contender_id: 76, // pp
        },
        {
          award_id: 17,
          contender_id: numberGen(79, 83), // k4
        },
        {
          award_id: 18,
          contender_id: 86, // itsay
        },
        {
          award_id: 19,
          contender_id: numberGen(89, 93), // k6
        },
        {
          award_id: 20,
          contender_id: numberGen(94, 98), // k7
        }
      ],
    };
    votePost(baseItem);
    counter += 1;
  }
  timerArr.push({ time: timeDate });
  ga('send', {
    hitType: 'event',
    eventCategory: formatUTCDate(),
    eventAction: userId,
    eventLabel: counter
  });

  $(".vote-num").html("");
  for (let j = 0; j < timerArr.length; j++) {
    let item = timerArr[j];
    $(".vote-num").append(`<div>当前时间：${item.time} 开始投票</div>`);
  }
}

// fetch 发送请求 【json】
function votePost(item) {
  fetch("https://api.komchadluek.net/api/award/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token:
        "VUkTC4BtyUGVt6u2UnF76BcKjXB9pu2zKEazSVudMzSDQfZsDkQS3wAjxwa7mg2MZWfRyers7N9ygv8Hb7hyPUXqpsZyqqpURkRJzzB67LYBGDB8PhVWBDS6v5mBVnVW",
    },
    body: JSON.stringify({
      ...item,
    }),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((json) => {
      console.log("获取的结果", json);
      if (json == "success") {
        allSuccessNum++;
        $(".vote-sum-successs").html(allSuccessNum);
      } else {
        alloverNum++;
        $(".vote-sum-over").html(alloverNum);
      }
      return json;
    })
    .catch((err) => {
      console.log("请求错误", err);
      alloverNum++;
      $(".vote-sum-over").html(alloverNum);
    });
}

// 发送名字到后台
function saveName() {
  let username = $('#nameInput').val();
  // 群内ID 为空的情况 若为必填项，就提示必填；若为选填项，直接return;
  if (!username) return;
  userId = username;
  ga('send', {
    hitType: 'event',
    eventCategory: 'User',
    eventAction: 'save',
    eventLabel: username
  });
  swal({
    title: "已保存",
    icon: "success"
  });
}

// 开启轮询
function openVote() {
  swal({
    title: "开启投票啦!",
    icon: "success",
  });
  if (timer) {
    swal({
      title: "已经开启投票啦，不要重复开启呦!",
      icon: "success",
    });
    return;
  }

  $(".vote-sum").css({ display: "block" });
  // 进入页面请求一次
  forVote();

  // 开启时间轮询，为容错尽量11分钟一次
  // 因ip随机，故改为间隔3分钟
  timer = setInterval(() => {
    forVote();
  }, 1000 * 60 * 3);
}

//关闭轮询
function closeVote() {
  swal({
    title: "投票关闭啦!",
    icon: "success",
  });
  if (timer) {
    clearInterval(timer);
    timer = null;
    timerArr = [];
    $(".vote-num").html("");
  }
}

//换算当前时间
function formatDate() {
  let dateTime = new Date().getTime();
  let date = new Date(dateTime);
  let monthT = date.getMonth() + 1;
  return `${date.getFullYear()}-${monthT < 10 ? "0" + monthT : monthT}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    } ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    }`;
}

function formatUTCDate() {
  let dateObj = new Date();
  let month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); // 固定月份格式两位数
  let day = ("0" + dateObj.getUTCDate()).slice(-2); // 固定日期格式两位数
  let year = dateObj.getUTCFullYear();
  return year.toString() + month.toString() + day.toString();
}
