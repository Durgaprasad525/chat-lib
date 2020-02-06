var user_id = prompt("enter your user_id");
var dest;


$(document).ready(function(){
  
  get_user()
  get_groups()

  var arr = []; // List of users

  $(document).on('click', '.msg_head', function() { 
    chatbox = $(this).parents().attr("rel") ;
    $('[rel="'+chatbox+'"] .msg_wrap').slideToggle('slow');
    return false;
  });

  $(document).on('click', '.close', function() { 
    chatbox = $(this).parents().parents().attr("rel") ;
    $('[rel="'+chatbox+'"]').hide();
    arr.splice($.inArray(chatbox, arr), 1);
    displayChatBox();
    return false;
  });
  
  $(document).on('click', '#sidebar-user-box', function() {
  
    var userID = $(this).attr("class");
    var username = $(this).children().text() ;
    
    if ($.inArray(userID, arr) != -1){
      arr.splice($.inArray(userID, arr), 1);
    }
    arr.unshift(userID);
    chatPopup =  '<div class="msg_box" isgroup="0" id="'+ userID+'" style="right:270px" rel="'+ userID+'">'+
    // '<div class="box-ring-container">' +
    //   '<div class="box-circle"></div></div>'+
      '<div class="msg_head">'+username +
      '</div>'+
      '<div class = "close"><img src="/static/images/close.jpg" width: "30px" height: "30px" /></div>'+
      '<div class="msg_wrap"> <div class="msg_body"> <div class="msg_push"></div> </div>'+
      '<div class="msg_footer"><textarea id="text_id" class="msg_input" rows="4"></textarea> <div class="image-upload"><label for="file-input"><img src="/static/images/paperclip.png" /></label><form id="upload-file" method="post" enctype="multipart/form-data" onchange = upload() ><input id="file-input" type="file" onchange = upload() /></form></div> </div> </div>' ;     
      $("body").append(  chatPopup  );
    displayChatBox(userID);

    $(document).on('keypress', 'textarea' , function(e) {       
      if (e.keyCode == 13 ) {   
        var msg = $(this).val();  
        $(this).val('');
        if(msg.trim().length != 0){    
          chatbox = $(this).parents().parents().parents().attr("rel") ;
          var userID = $(this).attr("class");
          var uName = $(this).parent().parent().parent().find('.msg_head');
          var isgroup = $(this).parent().parent().parent().parent().find('.msg_box').attr('isgroup');
          room = uName[0].innerText;
          msg_time = new Date();
          var cwindow =  $(this).parent().parent().parent().find('.msg_body');
          $(cwindow).append($('<div class="msg-right">'+msg+'<div class = "tick></div></div>'));
          socket.emit( 'my event',{
            from : user_id,
            message : msg,
            to: chatbox,
            d_time: msg_time,
            isgroup : isgroup
          });
        }
      }
    });
  });

  $(document).on('click', '#sidebar-group-box', function() {
  
    var userID = $(this).attr("class");
    var username = $(this).children().text() ;
    
    if ($.inArray(userID, arr) != -1){
      arr.splice($.inArray(userID, arr), 1);
    }
    arr.unshift(userID);
    chatPopup =  '<div class="msg_box" isgroup="1" id="'+ userID+'" style="right:270px" rel="'+ userID+'">'+
    // '<div class="box-ring-container">' +
    //   '<div class="box-circle"></div></div>'+
      '<div class="msg_head">'+username +
      '</div>'+
      '<div class = "close"><img src="/static/images/close.jpg" width: "30px" height: "30px" /></div>'+
      '<div class="msg_wrap"> <div class="msg_body"> <div class="msg_push"></div> </div>'+
      '<div class="msg_footer"><textarea id="text_id" class="msg_input" rows="4"></textarea> <div class="image-upload"><label for="file-input"><img src="/static/images/paperclip.png" /></label><form id="upload-file" method="post" enctype="multipart/form-data" onchange = upload() ><input id="file-input" type="file" onchange = upload() /></form></div> </div> </div>' ;     
      $("body").append(  chatPopup  );
    displayGroupChatBox(userID);

    $(document).on('keypress', 'textarea' , function(e) {       
      if (e.keyCode == 13 ) {   
        var msg = $(this).val();  
        $(this).val('');
        if(msg.trim().length != 0){    
          chatbox = $(this).parents().parents().parents().attr("rel") ;
          var userID = $(this).attr("class");
          var uName = $(this).parent().parent().parent().find('.msg_head');
          var isgroup = $(this).parent().parent().parent().parent().find('.msg_box').attr('isgroup');
          room = uName[0].innerText;
          msg_time = new Date();
          var cwindow =  $(this).parent().parent().parent().find('.msg_body');
          $(cwindow).append($('<div class="msg-right">'+msg+'</div>'));
          socket.emit( 'my event',{
            from : user_id,
            message : msg,
            to: chatbox,
            d_time: msg_time,
            isgroup : isgroup
          });
        }
      }
    });
  });

  socket.on( user_id, function( response ) {
    console.log( 'incoming message', response.message , response.to )
    if (response.isgroup == 0){
      var userID = response.userID;
      var username = response.from ;
      var activeWindows = $(".msg_box>.msg_head");
      var chatWindow = "";
      for(var i=0;i<activeWindows.length;i++){
        d = activeWindows[i].parentElement
        if($(d).attr('rel') ==username){
          chatWindow = activeWindows[i];
          break;
        }
      }
      if(chatWindow!=""){
        var targetWindow = "";
        targetWindow = $(chatWindow).parent().find('.msg_body');
        targetWindow.append($('<div class="msg-left">'+response.message+'</div>'));
        console.log(targetWindow);
      }
    }
      else {
      var username = response.to ;
      var activeWindows = $(".msg_box>.msg_head");
      var chatWindow = "";
      for(var i=0;i<activeWindows.length;i++){
        d = activeWindows[i].parentElement
        if($(d).attr('rel') ==username){
          chatWindow = activeWindows[i];
          break;
        }
      }
      if(chatWindow!=""){
        var targetWindow = "";
        targetWindow = $(chatWindow).parent().find('.msg_body');
        targetWindow.append($('<div class="msg-left">'+response.message+'</div>'));
        console.log(targetWindow);
      }

    }
    socket.emit( 'acknowledgement',{
      from: response.from,
      to: response.to,
      isgroup: response.isgroup,
      msgid: response.msgid  
    });
  });


  socket.on( 'online', function( response ) {
    //adding online tag where it is missing 
    $.each(response, function(index, value){
      if($("#chat-sidebar").find("."+value).find(".ring-container").length == 0){
        $("#chat-sidebar").find("."+value).append(
          '<div class="ring-container">'+
          '<div class="circle"></div></div></div>'
        );
      }
       if($(".msg_box#"+value).find(".msg_head").find(".box-ring-container").length == 0){
        $(".msg_box#"+value).find(".msg_head").append(
          '<div class="box-ring-container">'+
          '<div class="box-circle"></div></div>'
        )
       }
    });

    //removing online tag where it is not needed  
   
    $("#chat-sidebar").find(".ring-container").each(
      function(){
      employee_id =  $(this).parent().attr('class');
      employee_found = false;
      for(var i=0; i<response.length; i++){
        if (response[i] == employee_id)
          employee_found = true;
      }
      if (!employee_found){
        $("#chat-sidebar").find("."+employee_id).find(".ring-container").remove()
      }
    })

    $(".msg_box").find(".msg_head").find(".box-ring-container").each(
      function(){
      box_id =  $(this).parent().parent().attr('id');
      box_found = false;
      for(var i=0; i<response.length; i++){
        if (response[i] == box_id)
          box_found = true;
      }
      if (!box_found){
        $(".msg_box#"+box_id).find(".box-ring-container").remove()
      }
    })

    




  });

  function displayChatBox(destination){ 
    i = 270 ; // start position
    j = 260;  //next position
    $.each( arr, function( index, value ) {  
      if(index < 4){
        $('[rel="'+value+'"]').css("right",i);
        $('[rel="'+value+'"]').show();
        i = i+j;
        dest = value;    
      }
      else{
        $('[rel="'+value+'"]').hide();
      }
    }); 
    get_msg(destination); 
  }  
  
  function displayGroupChatBox(destination){ 
    i = 270 ; // start position
    j = 260;  //next position
    $.each( arr, function( index, value ) {  
      if(index < 4){
        $('[rel="'+value+'"]').css("right",i);
        $('[rel="'+value+'"]').show();
        i = i+j;
        dest = value;    
      }
      else{
        $('[rel="'+value+'"]').hide();
      }
    }); 
    getGroupmsg(destination); 
  }  
});

//get messages from database
function get_msg(dest){
  $.ajax({
    url: '/getMessages',
    type: 'POST',
    data:{ 
      source: user_id,
      dest: dest
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      $.each(response, function(index, value){
        if (value.destination == user_id && value.isread == 0){
          socket.emit( 'acknowledgement',{
            from: value.source,
            to: value.destination,
            msgid: value.id  
          });
          
        }
      });
      $.each(response, function(index, value){
      
        //if (value.source == user_id){
        var username = value.destination;
        var activeWindows = $(".msg_box>.msg_head");
        var chatWindow = "";
        for(var i=0;i<activeWindows.length;i++){
          d = activeWindows[i].parentElement
          if($(d).attr('rel') ==username){
            chatWindow = activeWindows[i];
            break;
          }
        }
        if(chatWindow!=""){
          // var targetWindow = $(chatWindow).parent().find('.msg-left');
          var targetWindow = "";
          targetWindow = $(chatWindow).parent().find('.msg_body');
          targetWindow.append($('<div class="msg-right">'+value.msgtext+'</div>'));
          console.log(targetWindow);
          
        }
        else {
          var username = value.source;
          var activeWindows = $(".msg_box>.msg_head");
          var chatWindow = "";
          for(var i=0;i<activeWindows.length;i++){
            d = activeWindows[i].parentElement
            if($(d).attr('rel') ==username){
              chatWindow = activeWindows[i];
              break;
            }
          }
          if(chatWindow!=""){
            // var targetWindow = $(chatWindow).parent().find('.msg-left');
            var targetWindow = "";
            targetWindow = $(chatWindow).parent().find('.msg_body');
            targetWindow.append($('<div class="msg-left">'+value.msgtext+'</div>'));
            console.log(targetWindow);
           
          }
      
        }
        
      })
    }
  })
};
//get group messages from database
function getGroupmsg(dest){
  $.ajax({
    url: '/getMessages',
    type: 'POST',
    data:{ 
      source: user_id,
      dest: dest
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      $.each(response, function(index, value){
        if (value.source == user_id){
        var username = value.destination;
        var activeWindows = $(".msg_box>.msg_head");
        var chatWindow = "";
        for(var i=0;i<activeWindows.length;i++){
          d = activeWindows[i].parentElement
          if($(d).attr('rel') ==username){
            chatWindow = activeWindows[i];
            break;
          }
        }
        if(chatWindow!=""){
          // var targetWindow = $(chatWindow).parent().find('.msg-left');
          var targetWindow = "";
          targetWindow = $(chatWindow).parent().find('.msg_body');
          targetWindow.append($('<div class="msg-right">'+value.msgtext+'</div>'));
          console.log(targetWindow);
        }
      }

        else {
          var username = value.destination;
          var activeWindows = $(".msg_box>.msg_head");
          var chatWindow = "";
          for(var i=0;i<activeWindows.length;i++){
            d = activeWindows[i].parentElement
            if($(d).attr('rel') ==username){
              chatWindow = activeWindows[i];
              break;
            }
          }
          if(chatWindow!=""){
            // var targetWindow = $(chatWindow).parent().find('.msg-left');
            var targetWindow = "";
            targetWindow = $(chatWindow).parent().find('.msg_body');
            targetWindow.append($('<div class="msg-left">'+value.msgtext+'</div>'));
            console.log(targetWindow);
          }
        }
      })
    }
  })
};
//get user from db
function get_user(){
  $.ajax({
    url: '/getUserList',
    type: 'GET',
    success: function (response) {
      console.log(response);
      $.each(response, function(index, value){
        $("#chat-sidebar").append(
          '<div id="sidebar-user-box" class='+value.id+'>'
          +'<img src="/static/images/sun.jpg" /><span id="slider-username">'+value.firstname+'&nbsp'+value.lastname+'&nbsp('+value.id+')</span></div>'
        );

      })
    }
  })
};

function get_groups(){
  $.ajax({
    url: '/getGroup',
    type: 'GET',
    success: function (response) {
      console.log(response);
      $.each(response, function(index, value){
        $("#group-sidebar").append(
          '<div id="sidebar-group-box" class='+value.id+'>'
          +'<img src="/static/images/chat.png" /><span id="slider-username">'+value.group_name+'&nbsp('+value.id+')</span></div>'
        );

      })

      
    }
  })
};

function upload(){
  
  
  var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: '/uploadFile',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log('Success!');
            },
        });
}


var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on( 'connect', function() {

  setInterval(function(){   
    socket.emit( 'check online', {
    data: user_id
    }) 
  }, 500000);

});