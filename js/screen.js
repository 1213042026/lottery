$(function() {
  var nameList = [
    "q","w","e","r","a",
    "s","d","f","g","h",
    "z","x","c","v"
  ];

  var prizeConfig = [
    {"awardName": "五獎", "prizeName": "牛排券", "prizeCount": 5, "prizeValue": "1140", "picture": "images/prize_5.png", "enable": true},
    {"awardName": "四獎", "prizeName": "推車", "prizeCount": 3, "prizeValue": "2500", "picture": "images/prize_4.png", "enable": true},
    {"awardName": "三獎", "prizeName": "點數五千點", "prizeCount": 3, "prizeValue": "5000", "picture": "images/prize_3.png", "enable": true},
    {"awardName": "二獎", "prizeName": "點數一萬點", "prizeCount": 2, "prizeValue": "10000", "picture": "images/prize_2.png", "enable": true},
    {"awardName": "頭獎", "prizeName": "iPad Air 2", "prizeCount": 1, "prizeValue": "13900", "picture": "images/prize_1.png", "enable": true},
  ];

  $('title')[0].innerText = "XXXXXXX";

  $("body").css('background-image', "url('images/bigbgd.png')");

  var flag = true;
  var timeoutFlag = false;
  var member = nameList;
  var tmpAr = nameList.concat();
  var memberCount = nameList.length;
  var venuePrize = [];
  var lotteryFlag = false;
  var listHeight = window.innerHeight * (65 / 1080);
  var winnerCount = 0;

  var imageScroll = (function () {
    var index = 0;
    var image = document.getElementById('image');
    image.style.top = 0 + 'px';
    var imageWidth = Number(listHeight);

    function Scroll() {
      if (index == (memberCount)) {
        index = 0;
        image.style.top = 0 + 'px';
        $("#image div:first").css({'margin-top' : '-' + listHeight / 2 + 'px'})
        addTop();
      } else {
        addTop();
      }
    }

    function addTop() {
      var imageTop = image.style.top? image.style.top.match(/\d+/).join() : 0;
      var imageTop = Number(imageTop);
      var num = listHeight;

      image.style.top = -(imageTop + num) + 'px';

      if (flag == false) {
        index = 0;
        $("#image").css({"top": listHeight / 2 + "px"})
        
        $("#image div:first").css({'margin-top' : '-' + listHeight + 'px'})
        
      } else {
        index++;
        setTimeout(Scroll, 100);
      }
    }

    function init() {
      flag = true;
      image.style.top = 0 + 'px';
      $("#image div:first").css({'margin-top' : '-' + listHeight / 2 + 'px'})
      setTimeout(Scroll, 20);
    }

    function stop() {
      flag = false;
    }

    return {
      init : init,
      stop : stop
    }
  })();


  var getTopBottom = function(name) {
    var top = "", bottom = "";

    member.forEach(function(m, idx) {
        if (m == name) {
            if (idx == 0) {
                top = member[member.length - 1];
            } else {
                top = member[idx - 1];
            }

            if (idx == member.length - 1) {
                bottom = member[0];
            } else {
                bottom = member[idx + 1];
            }
        }
    });

    var res = [top, bottom];
    return res;
  }

  var enableLottery = function (status) {
    var curPrizeName = $(".prize-title").text().split(':')[0].trim();
    for (var i = prizeConfig.length - 1; i >= 0; i--) {
      if (curPrizeName == prizeConfig[i].awardName) {
        if (status) {
          var tmpEnable = prizeConfig[i].enable;
          prizeConfig[i].enable = false;
          return tmpEnable;
        } else {
          prizeConfig[i].prizeCount = 0;
        }
      }
    }
  }

  var lotteryFuc = function() {
    var enable = enableLottery(true);
    if (!enable) {
      return;
    }
    if (lotteryFlag) {
      return;
    }
    lotteryFlag = true;
    imageScroll.init();

    (function() {
      if (flag) {
        var winners = winnerCount;
        var idx = 0;
        if (winners > 0) {
            var lotteryAndShow = function() {
                if (idx < winners) {
                    nameIdx = getRamdomNum(tmpAr.length);
                    var name = tmpAr[nameIdx].trim();
                    tmpAr.splice(nameIdx, 1);
                    if (idx + 1 == winners) {
                        imageScroll.stop();
                        $("#image").html("");
                        var ls = getTopBottom(name);
                        $("#image").append("<div>" + ls[0] + "</div>");
                        $("#image").append("<div>" + name + "</div>");
                        $("#image").append("<div>" + ls[1] + "</div>");
                    }

                    setTimeout(function() {
                        $("#prizeWinList").prepend("<div class=\"won-prize-list-item\"><div class=\"prize-winner-name\">" + name + "</div></div>");
                        $('.winner-name-div').dotdotdot();
                    }, 500)

                    setTimeout(function() {
                        idx++;
                        if (idx < winners) {
                            setTimeout(lotteryAndShow, 2000)
                        } else {
                          lotteryFlag = false;
                        }
                    }, 2000)
                } 
            }
            setTimeout(lotteryAndShow, 3000)
          } 
        }
    })()
    enableLottery();
  }

  var getRamdomNum = function(over) {
    var num = Math.floor(Math.random() * over);
    if (num < over) {
      return num;
    } else {
      getRamdomNum(over);
    }
  }

  $('.start-button').click(lotteryFuc)

  document.onkeydown = function(event) {
    if (event.keyCode == 32) {
        $('#start').addClass("btn-active")
    }
  }

  document.onkeyup = function(event) {
    switch (event.keyCode) {
      case 49:
        ready(prizeConfig[4]);
        break;
      case 50:
        ready(prizeConfig[3]);
        break;
      case 51:
        ready(prizeConfig[2]);
        break;
      case 52:
        ready(prizeConfig[1]);
        break;
      case 53:
        ready(prizeConfig[0]);
        break;
      case 32:
        $('#start').removeClass("btn-active")
        $('.start-button').trigger("click");
        break;
    }
  }

  function ready(data) {
    if (lotteryFlag) {
      return;
    }
    $("#prizeWinList").empty()
    winnerCount = data["prizeCount"]
    $(".prize-title").text(data["awardName"]+" : "+data["prizeCount"]+"名");
    $(".award").children("img").addClass('award-imge');
    $(".award").children("img").attr("src", data["picture"]);
    if (data["picture"]) {
      $(".award").css('background-image', 'none');
    };
    $(".award-name").text(data["prizeName"]);
    $("#image").html("");

    $("#image").css('height', ((nameList.length + 2)*listHeight)+"px");

    $.each(nameList, function(n,value) {
      $("#image").append("<div>"+nameList[n]+"</div>");
    });
    if (nameList.length >= 1) {
        $("#image").append("<div>"+nameList[0]+"</div>");
    }
    if (nameList.length >= 2) {
        $("#image").append("<div>"+nameList[1]+"</div>");
    }

    $(".start-button").css('display', "block");
    image.style.top = 0 + 'px';
    $("#image div:first").css({'margin-top' : '-' + listHeight / 2 + 'px'})
  };

});
