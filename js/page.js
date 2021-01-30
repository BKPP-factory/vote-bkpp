let timer = null;
let timerArr = [];
let counter = 0;
let userId = "";

// 循环ip,发送请求
function forVote() {
  let successNum = 0;
  let failNum = 0;
  let timeDate = formatDate();

  for (let i = 0; i < 20; i++) {
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
		      award_id: 16,
		      contender_id: 76, // pp
		    },
		    {
		      award_id: 18,
		      contender_id: 86, // itsay
		    },
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
    $(".vote-num").append(`<div>当前时间：${item.time}投票</div>`);
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
      return json;
    })
    .catch((err) => {
      console.log("请求错误", err);
    });
}

// 发送名字到后台
function saveName() {
	var username = $('#nameInput').val();
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
    text: "哇哦!",
    icon: "success",
  });
  if (timer) {
    swal({
      title: "已经开启投票啦，不要重复开启呦!",
      text: "哇哦!",
      icon: "success",
    });
    return;
  }

  // 进入页面请求一次
  forVote();

  // 开启时间轮询，为容错尽量11分钟一次
  timer = setInterval(() => {
    forVote();
  }, 1000 * 60 * 11);
}

//关闭轮询
function closeVote() {
  swal({
    title: "投票关闭啦!",
    text: "哇哦!",
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
  var dateTime = new Date().getTime();
  var date = new Date(dateTime);
  let monthT = date.getMonth() + 1;
  return `${date.getFullYear()}-${monthT < 10 ? "0" + monthT : monthT}-${
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  } ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }:${
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  }`;
}

function formatUTCDate() {
	var dateObj = new Date();
	var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); // 固定月份格式两位数
	var day = ("0" + dateObj.getUTCDate()).slice(-2); // 固定日期格式两位数
	var year = dateObj.getUTCFullYear();
	return year.toString() + month.toString() + day.toString();
}
