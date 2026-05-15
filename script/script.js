/**
 * 복원: script/script.js.backup 내용을 script.js에 덮어쓰기
 * DOM만 되돌릴 때: .swiper-wrapper [data-loop-fill="true"] 제거
*/



document.addEventListener("DOMContentLoaded", function(e){
    
    asideMenuHandler();
    mainOneteamHandler();
    closeSectionParallaxPin();
    closeSectionScrollSpy();
    caseSectionHandler();
    reviewSectionHandler();
})

/** Swiper loop용 — 원본 슬라이드를 slidesPerView × multiplier 만큼 채울 때까지 복제 */
const ensureLoopSlides = ($swiper, maxSlidesPerView, minMultiplier = 3) => {
    if (!$swiper || !$swiper.length) return 0;

    const $wrapper = $swiper.find(".swiper-wrapper").first();
    if (!$wrapper.length) return 0;

    const minCount = Math.ceil(maxSlidesPerView * minMultiplier);
    const $sourceSlides = () =>
        $wrapper.children(".swiper-slide").not('[data-loop-fill="true"]');

    if (!$sourceSlides().length) return $wrapper.children(".swiper-slide").length;

    while ($wrapper.children(".swiper-slide").length < minCount) {
        $sourceSlides().each(function () {
            $(this)
                .clone(false)
                .attr("data-loop-fill", "true")
                .appendTo($wrapper);
        });
    }

    return $wrapper.children(".swiper-slide").length;
};

const reviewSectionHandler = () => {

    const $swiperEl = $(".main .review-section .mySwiper");
    ensureLoopSlides($swiperEl, 3);

    var swiper = new Swiper($swiperEl[0], {
        slidesPerView: 3,
        loop : true,
        centeredSlides : true,
        spaceBetween: 58,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            1250: {
                spaceBetween: 20,
                spaceBetween: 58,
            },
            950: {
                slidesPerView: 2.5,
                spaceBetween: 15,
            },
            650: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            0: {
                slidesPerView: 1.5,
                spaceBetween: 15,
            },
        },
      });
}

const caseSectionHandler = () => {
    const $swiperEl = $(".main .case-section .mySwiper");
    ensureLoopSlides($swiperEl, 3);

    var swiper = new Swiper($swiperEl[0], {
        slidesPerView: 3,
        loop : true,
        centeredSlides : true,
        spaceBetween: 58,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
            1250: {
                spaceBetween: 20,
                spaceBetween: 58,
            },
            950: {
                slidesPerView: 2.5,
                spaceBetween: 15,
            },
            650: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            0: {
                slidesPerView: 1.5,
                spaceBetween: 15,
            },
        },
      });
};

const mainOneteamHandler = () => {

    const $swiperEl = $(".main .oneteam-section .slide-wrap .mySwiper");
    const slideCount = ensureLoopSlides($swiperEl, 3);

    var swiper = new Swiper($swiperEl[0], {
        slidesPerView: 1.5,
        spaceBetween: 40,
        loopedSlides: slideCount || 10,
        loop : true,
        centeredSlides : true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            1250: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            950: {
                slidesPerView: 2.5,
            },
            650: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1.2,
                spaceBetween: 15,
            },
        }
    });


}

/** close-section: 951px 이상만 핀. 시작은 half 기준, 종료는 section 맨 아래까지(하단 패딩 포함) */
const closeSectionParallaxPin = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".main .close-section");
    if (!section) return;

    const half = section.querySelector(".half-div");
    const pinWrap = section.querySelector(".left-pin-wrap");
    if (!half || !pinWrap) return;

    const HEADER_OFFSET = 100;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 951px)", () => {
        const st = ScrollTrigger.create({
            trigger: half,
            start: `top top+=${HEADER_OFFSET}`,
            endTrigger: section,
            end: "bottom bottom",
            pin: pinWrap,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        });
        return () => st.kill();
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(refresh);
    }
    requestAnimationFrame(() => requestAnimationFrame(refresh));
};

/** close-section: 뷰포트 기준 li.active (ScrollSmoother 대비 ScrollTrigger.onUpdate + rAF) */
const closeSectionScrollSpy = () => {
    const section = document.querySelector(".main .close-section");
    if (!section) return;

    const items = section.querySelectorAll(".half-div .item-list > li");
    if (!items.length) return;

    /** 이 높이(뷰포트 위에서의 비율)를 지나면 해당 단계가 “현재”로 잡힘 — 숫자 낮출수록 더 빨리 바뀜 */
    const LINE_RATIO = 0.30;

    const updateActive = () => {
        const secRect = section.getBoundingClientRect();
        if (secRect.bottom < 0 || secRect.top > window.innerHeight) return;

        const y = window.innerHeight * LINE_RATIO;
        let bestIdx = 0;
        items.forEach((li, i) => {
            if (li.getBoundingClientRect().top < y) bestIdx = i;
        });

        items.forEach((li, i) => {
            li.classList.toggle("active", i === bestIdx);
        });
    };

    let raf = 0;
    const schedule = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(updateActive);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: updateActive,
        });
    }

    schedule();
};

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