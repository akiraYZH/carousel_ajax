function Carousel(id, selected) {
    this.carousel = document.querySelector(id);
    this.oUl = this.carousel.querySelector('.carousel>ul');
    this.oBtn_l = this.carousel.querySelector('.left_arrow');
    this.oBtn_r = this.carousel.querySelector('.right_arrow');
    this.oPoint_box = this.carousel.querySelector('.point_box ul');
    this.aPoints = [];
    this.now_index = last_index = 0;
    // this.oCarousel = document.querySelector('.carousel'),
    this.timer = null;
    this.is_run = false;
    this.is_load = false;
    this.domain = 'http://jianshe.bluej.cn';







    this.init(selected);
    

    this.oBtn_l.addEventListener('click', () => {
        if (!this.is_run && !this.is_load) {
            console.log('click');

            --this.now_index;
            this.run();

        }

    })

    this.oBtn_r.addEventListener('click', () => {
        console.log(this);

        console.log(this.is_run, this.is_load);

        if (!this.is_run && !this.is_load) {
            console.log('click');
            ++this.now_index;
            this.run();
        }
    })

    //鼠标移入
    this.carousel.addEventListener('mouseenter', function () {
        // console.log(this.timer);
        
        clearInterval(this.timer);


    }.bind(this))
    //鼠标移出
    this.carousel.addEventListener('mouseleave', function () {
        this.autoplay();
    }.bind(this))



    //Click dots event realized by event delegation
    this.oPoint_box.addEventListener('click', function(e){
        let ev = e || window.event;
        let oLi = ev.target || ev.srcElement;
        // console.log(oLi.nodeName);
        if (oLi.nodeName.toLowerCase() == 'li') {
            if (!this.is_run && !this.is_load) {
                if (this.last_index != oLi.index) {
                    this.now_index = oLi.index;
                    this.run();
                }
            }
        }
    }.bind(this));








    this.oUl.addEventListener('transitionend', function () {
        this.is_run = false;
        // log
        // console.log(this.is_run);

    }.bind(this))
    // 1.自动轮播(鼠标放上去停)
    // 2.小圆点要跟着轮播图变化而变化(acitive切换)
    // 3.点击小圆点轮播图要切换到对应的图片
    // 4.提高要求, 动画结束后才允许用户点击下一次 事件移出与绑定


}


//自动轮播
Carousel.prototype.autoplay = function (){
    
    
    this.timer = setInterval(function () {
        // console.log(this);
        if (!this.is_run && !this.is_load) {
            // (++now_index == aPoints.length) && (now_index = 0);
            ++this.now_index;
            this.run();
        }
    }.bind(this), 1500);

}


Carousel.prototype.calcIndex = function (index) {
    return index + 1;
}

Carousel.prototype.init = async function (id) {
    
    
    this.now_index = this.last_index = 0;
    console.log(this.timer);
    
    clearInterval(this.timer);
    this.autoplay();
    // console.log(this);
    this.is_run = false;
    this.is_load = true;
    this.oUl.innerHTML = '';
    this.oPoint_box.innerHTML = '';
    // console.log('123');

    let aImgs = await this.getImgs(id).then((data) => data, (code) => alert(code));
    console.log(aImgs);
    aImgs.data.forEach((val) => {
        // console.log(val.ch_img_url);

        this.oUl.innerHTML += `
            <li>
                <a href="">
                    <img src="${this.domain+val.ch_img_url}" alt="">
                    <div class="mask"></div>
                </a>
            </li>
            `;
        this.oPoint_box.innerHTML += `<li></li>`
    })
    this.aPoints = document.querySelectorAll('.point_box li');
    this.aPoints.forEach((obj, index) => obj.index = index);
    this.oUl.insertBefore(this.oUl.lastElementChild.cloneNode(true), this.oUl.children[0]);
    this.oUl.appendChild(this.oUl.children[1].cloneNode(true));

    this.oUl.style.transition = 'none';
    this.oUl.style.transform = `translateX(-${this.calcIndex(this.now_index)*100}%)`;
    getComputedStyle(this.oUl, false).transition;
    this.oUl.style.transition = '';
    this.aPoints[0].classList.add('active');
    this.is_load = false;
}

//when switch the img
Carousel.prototype.run = function () {


    this.is_run = true;
    // oUl.style.transition='';
    this.oUl.style.transform = `translateX(-${this.calcIndex(this.now_index)*100}%)`;
    (this.now_index < 0 || this.now_index == this.aPoints.length) && (this.oUl.addEventListener('transitionend', this.restore.bind(this)));
    if (this.now_index < 0) {
        this.now_index = this.aPoints.length - 1;
    } else if (this.now_index == this.aPoints.length) {
        this.now_index = 0;
    }
    this.aPoints[this.last_index].classList.remove('active');
    this.aPoints[this.now_index].classList.add('active');
    this.last_index = this.now_index;

}


// switch the img position when the animation ended
Carousel.prototype.restore = function () {

    // console.log(this);

    this.oUl.style.transition = 'none';

    if (this.now_index < 0) {
        this.now_index = this.aPoints.length - 1;
    } else if (this.now_index == this.aPoints.length) {
        this.now_index = 0;

    }
    this.last_index = this.now_index;

    this.oUl.style.transform = `translateX(-${this.calcIndex(this.now_index)*100}%)`;

    getComputedStyle(this.oUl).transition;
    this.oUl.style.transition = '';
    this.is_run = false;
    this.oUl.removeEventListener('transitionend', this.restore)

};

Carousel.prototype.getImgs = function (id) {
    return new Promise(function (resolve, failFn) {
        _ajax('http://jianshe.bluej.cn/api/index/get_carousel?position_id=' + id, '', 'GET', resolve, failFn);
    });
}