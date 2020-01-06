carousel();

async function carousel() {
    let oUl = document.querySelector('.carousel>ul'),
        oBtn_l = document.querySelector('.left_arrow'),
        oBtn_r = document.querySelector('.right_arrow'),
        oSelect = document.querySelector('#nav'),
        oPoint_box = document.querySelector('.point_box ul'),
        aPoints = [],
        now_index = last_index = 0,
        oCarousel = document.querySelector('.carousel'),
        timer = null,
        is_run = false;
    is_load = false;
    domain = 'http://jianshe.bluej.cn';

    // let url = 'js/carousel.json';

    let aSelect = await getOptions().then((data) => data);
    console.log();
    insertSelect(aSelect);


    init(aSelect[0].id);
    autoplay();

    oBtn_l.addEventListener('click', () => {
        if (!is_run && !is_load) {
            console.log('click');
            
            --now_index;
            run();

        }

    })

    oBtn_r.addEventListener('click', () => {
        console.log(is_run, is_load);
        
        if (!is_run && !is_load) {
            console.log('click');
            ++now_index
            run();
        }
    })

    //鼠标移入
    oCarousel.addEventListener('mouseenter', function () {

        clearInterval(timer);


    })
    //鼠标移出
    oCarousel.addEventListener('mouseleave', function () {
        autoplay();
    })

    //通过闭包实现小圆点的切换
    // for (var i = 0; i < aPoints.length; i++) {
    //     (function (j) {
    //         aPoints[j].addEventListener('click', function () {
    //             if (!is_run) {
    //                 if (last_index != j) {
    //                     now_index = j;
    //                     run();
    //                 }
    //             }

    //         })
    //     })(i)
    // }

    //Click dots event realized by event delegation
    oPoint_box.addEventListener('click', (e) => {
        let ev = e || window.event;
        let oLi = ev.target || ev.srcElement;
        // console.log(oLi.nodeName);
        if (oLi.nodeName.toLowerCase() == 'li') {
            if (!is_run && !is_load) {
                if (last_index != oLi.index) {
                    now_index = oLi.index;
                    run();
                }
            }
        }
    })

    oSelect.addEventListener('change', () => {
        let selectedIndex = oSelect.options[oSelect.selectedIndex].getAttribute('index');
        // console.log(selectedIndex);
        init(selectedIndex);

    })

    async function init(id) {
        now_index = last_index = 0;
        is_run = false;
        is_load = true;
        oUl.innerHTML = '';
        oPoint_box.innerHTML = '';
        let aImgs = await getImgs(id).then((data) => data, (code) => alert(code));
        console.log(aImgs);
        aImgs.data.forEach((val) => {
            // console.log(val.ch_img_url);

            oUl.innerHTML += `
                <li>
                    <a href="">
                        <img src="${domain+val.ch_img_url}" alt="">
                        <div class="mask"></div>
                    </a>
                </li>
                `;
            oPoint_box.innerHTML += `<li></li>`
        })
        aPoints = document.querySelectorAll('.point_box li');
        aPoints.forEach((obj, index) => obj.index = index);
        oUl.insertBefore(oUl.lastElementChild.cloneNode(true), oUl.children[0]);
        oUl.appendChild(oUl.children[1].cloneNode(true));

        oUl.style.transition = 'none';
        oUl.style.transform = `translateX(-${calcIndex(now_index)*100}%)`;
        getComputedStyle(oUl, false).transition;
        oUl.style.transition = '';
        aPoints[0].classList.add('active');   
        is_load = false;
    }

    function calcIndex(index) {
        return index + 1;
    }

    // switch the img position when the animation ended
    function restore() {

        oUl.style.transition = 'none';

        if (now_index < 0) {
            now_index = aPoints.length - 1;
        } else if (now_index == aPoints.length) {
            now_index = 0;

        }
        last_index = now_index;

        oUl.style.transform = `translateX(-${calcIndex(now_index)*100}%)`;

        getComputedStyle(oUl).transition;
        oUl.style.transition = '';
        is_run = false;
        oUl.removeEventListener('transitionend', restore)

    }

    //when switch the img
    function run() {
        console.log('123');

        is_run = true;
        // oUl.style.transition='';
        oUl.style.transform = `translateX(-${calcIndex(now_index)*100}%)`;
        (now_index < 0 || now_index == aPoints.length) && (oUl.addEventListener('transitionend', restore));
        if (now_index < 0) {
            now_index = aPoints.length - 1;
        } else if (now_index == aPoints.length) {
            now_index = 0;
        }
        aPoints[last_index].classList.remove('active');
        aPoints[now_index].classList.add('active');
        last_index = now_index;

    }




    //自动轮播
    function autoplay() {

        timer = setInterval(function () {
            if (!is_run && !is_load) {
                // (++now_index == aPoints.length) && (now_index = 0);
                ++now_index;
                run();
            }
        }, 1500);

    }

    oUl.addEventListener('transitionend', function () {
        is_run = false;
        // alert();
    })
    // 1.自动轮播(鼠标放上去停)
    // 2.小圆点要跟着轮播图变化而变化(acitive切换)
    // 3.点击小圆点轮播图要切换到对应的图片
    // 4.提高要求, 动画结束后才允许用户点击下一次 事件移出与绑定

    function insertSelect(data) {
        // console.log(data);
        data.forEach(function (val, index) {



            let oOption = document.createElement('option');
            oOption.setAttribute('index', index + 1);
            oOption.innerHTML = val.name;
            oSelect.appendChild(oOption);
        })
        // console.log(oSelect.children);

    }


    function getOptions() {
        return new Promise(function (resolve, failFn) {
            _ajax('js/position_list.json', '', 'GET', resolve, failFn);
        });
    }

    function getImgs(id) {
        return new Promise(function (resolve, failFn) {
            _ajax('http://jianshe.bluej.cn/api/index/get_carousel?position_id=' + id, '', 'GET', resolve, failFn);
        });
    }
}


function _ajax(_url, arg = '', method = 'GET', succFn, failFn) {
    // var domain = 'http://jianshe.bluej.cn';
    var req_url = '';
    var xhr = null;

    method == 'GET' ? req_url = _url + '?' + arg : req_url = _url;
    window.XMLHttpRequest ? xhr = new XMLHttpRequest : xhr = new ActiveXObject('Microsoft.XMLHTTP');

    xhr.open(method, req_url);
    if (method == 'GET') {
        xhr.send();
    } else {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(arg);
    }
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState == 4) {
            // if (xhr.status == 200) {
            //     return succFn(JSON.parse(xhr.responseText));
            // } else {
            //     return failFn(xhr.status);
            // }
            xhr.status == 200?succFn(JSON.parse(xhr.responseText)):failFn(xhr.status);
        }
    });
}

// class Person{
//     constructor(){
//         // alert(this);
//     }

//     fn(){
//         console.log(this);
//     }
    
// }
// new Person().fn();
