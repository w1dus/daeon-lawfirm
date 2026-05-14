

document.addEventListener("DOMContentLoaded", function(e){
    
    asideMenuHandler();
})



const asideMenuHandler = () => {

    //슬라이드 메뉴 열기
    $('header .btn-wrap .menu-btn').click(function(){
        $('.aside-menu').addClass('active');
        $('.aside-menu .aside-content').addClass('active');
    })

    //슬라이드 메뉴 닫기
    $('.aside-menu .btn-wrap .close-btn').click(function(){
        $('.aside-menu').removeClass('active');
        $('.aside-menu .aside-content').removeClass('active');
        $('.aside-menu').removeClass('active');
        $('.aside-menu .aside-content').removeClass('active');
    })
    $(".aside-menu").click(function(){
        $('.aside-menu').removeClass('active');
        $('.aside-menu .aside-content').removeClass('active');
        $('.aside-menu').removeClass('active');
        $('.aside-menu .aside-content').removeClass('active');
    })
    $(".aside-menu .aside-content").click(function(e){
        e.stopPropagation();
    })
    $(".aside-menu .aside-content .sub-menu-list").click(function(e){
        e.stopPropagation();
    })
    $(".aside-menu .aside-content .sub-menu-list .sub-item").click(function(e){
        e.stopPropagation();
    })

    //서브 메뉴 토글
    $('.aside-menu .menu-box-wrap .meu-list .item').click(function(){
        $(this).toggleClass('show');
        $(this).siblings('.sub-menu-list').slideToggle(300);
    })
}