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

    textFlowSectionHandler();
    pcNavMenuHandler();
    lawyerFlowSectionHandler();
    inquiryTabSectionHandler();
    glightboxHandler();

    countingNumberHandler();
    aosHandler();

})

const aosHandler = () => {
    if (typeof AOS === "undefined") return;

    AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
    });

    const refreshAos = () => {
        if (typeof AOS !== "undefined") AOS.refresh();
    };

    window.addEventListener("load", refreshAos);

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.addEventListener("refresh", refreshAos);
    }
};

const countingNumberHandler = () => {
    const countList = document.querySelector('.main .visual-section');
    const numbers = document.querySelectorAll('.main .visual-section .half-div .right-div .item .content .count');
    const duration = 1; // Duration in seconds
    if (!countList) return;

    function formatNumber(num) {
        return num.toLocaleString();
    }

    function animateCount() {
        numbers.forEach(number => {
            const target = +number.getAttribute('data-count');
            const increment = target / (duration * 60); // 60 frames per second
            let current = 0;

            function updateCount() {
                current += increment;
                if (current < target) {
                    number.textContent = formatNumber(Math.ceil(current)) + "";
                    requestAnimationFrame(updateCount);
                } else {
                    number.textContent = formatNumber(target) + "";
                }
            }
            updateCount();
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countList.classList.add('on');
                animateCount();
                observer.unobserve(countList);
            }
        });
    }, {
        threshold: 0.8
    });
    observer.observe(countList);
}

const glightboxHandler = () => {
    if (typeof GLightbox !== 'undefined') {
        GLightbox({ selector: '.glightbox' });
    }
}

const inquiryTabSectionHandler = () => {
    const $tabList = $(".sub.inquiry .inquiry-form-section .apply-tab-list .item");
    const $panels = $(".sub.inquiry .inquiry-form-section .apply-content-list > li");

    if (!$tabList.length || !$panels.length) return;

    $tabList.on("click", function () {
        const index = $(this).closest("li").index();

        $tabList.removeClass("active");
        $(this).addClass("active");

        $panels.removeClass("is-active");
        $panels.eq(index).addClass("is-active");
    });
};


/** 변호사 카드 Slick — 관리자 등록 개수(원본 .slide)에 맞춰 loop용 복제 */

const lawyerFlowSectionHandler = () => {
    const $flow = $(".sub .lawyer-flow-section .lawyer-flow-slider");
    if (!$flow.length) return;

    const lawyerFlowSlickOptions = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 18000,
        cssEase: "linear",
        pauseOnHover: false,
        pauseOnFocus: false,
        swipe: false,
        draggable: false,
        waitForAnimate: false,
    };

    const ensureLawyerFlowSlides = ($slider) => {
        if (!$slider || !$slider.length) return 0;
    
        const $legacyTrack = $slider.children(".lawyer-flow-track");
        if ($legacyTrack.length) {
            $legacyTrack.children(".slide").appendTo($slider);
            $legacyTrack.remove();
        }
    
        $slider.find('[data-lawyer-flow-fill="true"]').remove();
    
        const $sourceSlides = () =>
            $slider.children(".slide").not('[data-lawyer-flow-fill="true"]');
    
        if (!$sourceSlides().length) return 0;
    
        const getSlideWidth = () => $sourceSlides().first().outerWidth(true) || 313;
        const minCount = Math.max(
            4,
            Math.ceil(((($slider.innerWidth() || window.innerWidth) * 2) / getSlideWidth()))
        );
    
        let guard = 0;
        while ($slider.children(".slide").length < minCount && guard < 30) {
            $sourceSlides().each(function () {
                $(this)
                    .clone(false)
                    .attr("data-lawyer-flow-fill", "true")
                    .appendTo($slider);
            });
            guard++;
        }
    
        return $slider.children(".slide").length;
    
        
    };
    

    const resumeFlow = () => {
        if (!$flow.hasClass("slick-initialized")) return;
        $flow.slick("setPosition");
        $flow.slick("slickPlay");
    };

    const buildLawyerFlow = () => {
        if ($flow.hasClass("slick-initialized")) {
            $flow.slick("unslick");
        }
        ensureLawyerFlowSlides($flow);
        $flow.slick(lawyerFlowSlickOptions);
        resumeFlow();
    };

    buildLawyerFlow();

    $flow.off("breakpoint reInit.lawyerFlow").on("breakpoint reInit.lawyerFlow", function () {
        setTimeout(resumeFlow, 50);
    });

    let resizeTimer;
    $(window)
        .off("resize.lawyerFlow load.lawyerFlow")
        .on("resize.lawyerFlow", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildLawyerFlow, 150);
        })
        .on("load.lawyerFlow", resumeFlow);

    /** 관리자에서 슬라이드 추가·삭제 후 호출 */
    window.refreshLawyerFlowSlider = buildLawyerFlow;
};

const pcNavMenuHandler = () => {
    const closePcNavMenu = () => {
        $("header").removeClass("menu-show white-bg");
    };

    $("header nav").mouseenter(function () {
        $("header").addClass("menu-show white-bg");
    });

    $(".pc-menu-hover-bg").mouseleave(function () {
        closePcNavMenu();
    });

    /** header.menu-show + .pc-menu-hover-bg 영역에서 브라우저 밖으로 나가면 닫기 */
    $(document).on("mouseleave.pcNavMenu", function () {
        if ($("header").hasClass("menu-show")) {
            closePcNavMenu();
        }
    });

    $(document).on("mouseout.pcNavMenu", function (e) {
        if (!e.relatedTarget && $("header").hasClass("menu-show")) {
            closePcNavMenu();
        }
    });

    /** 스크롤 시 메뉴 닫기 (ScrollSmoother 사용 페이지 포함) */
    $(window).on("scroll.pcNavMenu", function () {
        if ($("header").hasClass("menu-show")) {
            closePcNavMenu();
        }
    });
};


const textFlowSectionHandler = () => {
    const $flow = $('.sub .text-flow-section .text-flow-slider');
    if (!$flow.length) return;

    const slickOptions = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 40000,
        cssEase: 'linear',
        pauseOnHover: false,
        pauseOnFocus: false,
        swipe: false,
        draggable: false,
        waitForAnimate: false
    };

    $flow.slick(slickOptions);

    const resumeFlow = () => {
        if (!$flow.hasClass('slick-initialized')) return;
        $flow.slick('setPosition');
        $flow.slick('slickPlay');
    };

    $flow.on('breakpoint reInit', function () {
        setTimeout(resumeFlow, 50);
    });

    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resumeFlow, 150);
    });

    $(window).on('load', resumeFlow);
};

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

const swiperObserveOptions = {
    observer: true,
    observeParents: true,
    resizeObserver: true,
};

/** 메인 Swiper — oneteam / case / review 공통 */
const mainSwiperAutoplay = {
    delay: 1200,
    disableOnInteraction: false,
};
const mainSwiperSpeed = 250;

const mainSwiperInstances = [];
let mainSwiperResizeBound = false;

const getSwiperPagination = ($swiperEl) => {
    const paginationEl = $swiperEl
        .closest("section, .slide-wrap")
        .find(".swiper-pagination")[0];
    return paginationEl
        ? { pagination: { el: paginationEl, clickable: true } }
        : {};
};

const refreshMainSwipers = () => {
    if (typeof ScrollSmoother !== "undefined" && ScrollSmoother.get()) {
        ScrollSmoother.get().refresh();
    }

    mainSwiperInstances.forEach((swiper) => {
        if (!swiper || swiper.destroyed) return;

        const realIndex = swiper.params.loop ? swiper.realIndex : swiper.activeIndex;

        swiper.updateSize();
        swiper.updateSlides();
        swiper.update();

        if (swiper.params.loop) {
            swiper.slideToLoop(realIndex, 0, false);
        } else {
            swiper.slideTo(realIndex, 0, false);
        }
    });

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
};

const bindSwiperResize = (swiper) => {
    mainSwiperInstances.push(swiper);

    if (!mainSwiperResizeBound) {
        mainSwiperResizeBound = true;

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refreshMainSwipers, 200);
        });
        window.addEventListener("load", refreshMainSwipers);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(refreshMainSwipers);
    });

    return refreshMainSwipers;
};

/** .inner max-width 1200px → container 기준 1250 breakpoint는 PC에서도 3개 미적용(2.5로 보임) */
const caseReviewBreakpoints = {
    1200: {
        slidesPerView: 3,
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
};

const reviewSectionHandler = () => {
    const $swiperEl = $(".main .review-section .mySwiper");
    if (!$swiperEl.length) return;

    ensureLoopSlides($swiperEl, 3);

    const swiper = new Swiper($swiperEl[0], {
        ...swiperObserveOptions,
        slidesPerView: 3,
        loop: true,
        loopedSlides: 3,
        centeredSlides: true,
        spaceBetween: 58,
        breakpointsBase: "container",
        speed: mainSwiperSpeed,
        autoplay: mainSwiperAutoplay,
        breakpoints: caseReviewBreakpoints,
    });

    bindSwiperResize(swiper);
};

const caseSectionHandler = () => {
    const $swiperEl = $(".main .case-section .mySwiper");
    if (!$swiperEl.length) return;

    ensureLoopSlides($swiperEl, 3);

    const swiper = new Swiper($swiperEl[0], {
        ...swiperObserveOptions,
        ...getSwiperPagination($swiperEl),
        slidesPerView: 3,
        loop: true,
        loopedSlides: 3,
        centeredSlides: true,
        spaceBetween: 58,
        breakpointsBase: "container",
        speed: mainSwiperSpeed,
        autoplay: mainSwiperAutoplay,
        breakpoints: caseReviewBreakpoints,
    });

    bindSwiperResize(swiper);
};

const mainOneteamHandler = () => {
    const $swiperEl = $(".main .oneteam-section .slide-wrap .mySwiper");
    if (!$swiperEl.length) return;

    const slideCount = ensureLoopSlides($swiperEl, 3);

    const swiper = new Swiper($swiperEl[0], {
        ...swiperObserveOptions,
        ...getSwiperPagination($swiperEl),
        slidesPerView: 1.5,
        spaceBetween: 40,
        loopedSlides: slideCount || 10,
        loop: true,
        centeredSlides: true,
        speed: mainSwiperSpeed,
        autoplay: mainSwiperAutoplay,
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
        },
    });

    bindSwiperResize(swiper);
};

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