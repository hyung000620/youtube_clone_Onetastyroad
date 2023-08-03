//페이지 이동
function moveHome(){location.href= './index_home.html';}
function moveVideo(){location.href= './index_video.html';}
function moveChannel(){location.href= './index_channel.html';}

/************* comments *************/

// 공통적으로 쓰이는 변수
let commentInput = document.getElementById("comment");
// 댓글창 비우기
const commentClear = () => (commentInput.value = '', document.getElementById("commentSubmit").disabled = true);

// 댓글 작성
let commentCount = 2;
function addComment() {
    const commentInputValue = commentInput.value;
    const viewComment = document.querySelector('.view-comment');
    const newCommentDiv = document.createElement("div");
    newCommentDiv.innerHTML = `
        <div class="profile-pic"><img src="img/video/User-Pic3.png" alt=""></div>
        <div class="view-area">
            <div class="comment-header">James Gouse <span> 방금 전</span></div>
            <div class="comment-text">${commentInputValue}</div>
            <div class="comment-toolbar">
                <img src="img_svg/video_svg/Liked.svg" alt="" onclick="toggleLike(this)">
                <p class="likeCount">0</p>
                <img src="img_svg/video_svg/DisLiked.svg" alt="" onclick="toggleLike(this)">
                <p class="likeCount">0</p>
                <p>REPLY</p>
            </div>
        </div>
    `;
    viewComment.appendChild(newCommentDiv);

    commentClear();

    // 댓글 수 카운팅
    commentCount++;
    const countElement = document.querySelector('.count');
    countElement.textContent = commentCount + (commentCount === 1 ? ' Comment' : ' Comments');

}
// 'enter키'로 댓글 작성
const commentEnterkey = () => event.keyCode === 13 && commentInput.value.trim() !== '' && addComment();

// 댓글 버튼 보이기, 취소 버튼으로 숨기기
const showCommentBtn = () => document.getElementById('commentBtn').style.display = 'inline-block';
const hideCommentBtn = () => document.getElementById('commentBtn').style.display = 'none';

// 댓글 input값 비었을때 버튼 비활성화
const commentAction = () => document.getElementById("commentSubmit").disabled = commentInput.value.trim() === '';


let toggle = true;
function subcribe(){
    const img = document.getElementById('images');
    const subs = document.getElementById('subscribersCount');
    const sentence = subs.textContent;
    const numberPattern = /\d+/;
    const number = parseInt(sentence.match(numberPattern)[0]);
    toggle = !toggle;
    if(toggle){
        subs.textContent = `구독자 ${number-1}명`;
        img.src = 'img/channel/Subscribes-Btn.png';
    }else{
        subs.textContent = `구독자 ${number+1}명`;
        img.src = 'img/channel/subscribed-Btn.png';
    }
}


// 조회수 단위
function thousandK(num){
    const nFormatter = (num, digits) => {
        const unit = [
            { value: 1,  symbol: ''},
            { value: 1e3,  symbol: 'k'},
            { value: 1e6,  symbol: 'M'},
            { value: 1e9,  symbol: 'G'}
        ]
        const rr = /\.0 + $|(\.[0-9] * [1-9])0 + $/
        let i
        for (i = unit.length - 1; i > 0; i--) {
            if (num >= unit[i].value) {
                break
            }
        }
        return (num / unit[i].value).toFixed(digits).replace(rr, '$1') + unit[i].symbol
    }
    return nFormatter(num, 0);
}

let hambuger = true;
let innerWidth = window.innerWidth; // 화면 크기

// 사이드 바 토글
function sideBarToggle(){
    const [sideBar, miniSideBar, sectionInner] = [document.querySelector('.side-bar'),document.querySelector('.mini-side-bar'),document.getElementById('sectionInner')];
    
    hambuger = !hambuger;
    if(hambuger){ 
        sideBar.style.setProperty('--side-bar','block');
        miniSideBar.style.setProperty('--mini-side-bar','none');
        sectionInner.style.setProperty('--sectionInner','250px');
    }else{
        sideBar.style.setProperty('--side-bar','none');
        miniSideBar.style.setProperty('--mini-side-bar','block');
        sectionInner.style.setProperty('--sectionInner','80px');
    }

}
// 인라인 스타일 제거
function removeInlineStyle(){
    const [sideBar, miniSideBar, sectionInner] = [document.querySelector('.side-bar'),document.querySelector('.mini-side-bar'),document.getElementById('sectionInner')];
    const elementsToRemoveStyle = [sideBar, miniSideBar, sectionInner];

    elementsToRemoveStyle.forEach(element => {
    element.removeAttribute('style');
    });
}
window.addEventListener('resize', () => {
    removeInlineStyle();
});

// 좋아요 버튼 토글
function toggleLike(likeImage) {
    const likeCountElement = likeImage.nextElementSibling;
    const likeCount = parseInt(likeCountElement.textContent);

    if (likeImage.classList.contains('liked')) {
        likeImage.src = likeImage.src.includes('/colorLiked')? "img_svg/video_svg/Liked.svg": "img_svg/video_svg/DisLiked.svg";
        likeImage.classList.remove('liked');
        likeCountElement.textContent = likeCount - 1;
    } else {
        likeImage.src = likeImage.src.includes('/Liked')? "img_svg/video_svg/colorLiked.svg": "img_svg/video_svg/colorDisLiked.svg";
        likeImage.classList.add('liked');
        likeCountElement.textContent = likeCount + 1;
    }
}


/**
 * 마우스 hover 시에 text 박스 생성 - >
 * 마우스 out 시에 text 박스 삭제.
 * 
 */
const imageContainers = document.querySelectorAll('.text-icon');

imageContainers.forEach((imageContainer) => {
    imageContainer.addEventListener('mouseover', function(event) {
      if (event.target.tagName === 'IMG') {
        const altText = event.target.getAttribute('alt');
        showHoverText(altText, event.clientX, event.clientY);
      }
    });
  
    imageContainer.addEventListener('mouseout', function() {
      hideHoverText();
    });
  });


//텍스트 박스 위치 지정 함수
function showHoverText(text, x, y) {
    const textBox = createTextBox(text);
    textBox.style.left = `${x}px`;
    textBox.style.top = `${y+30}px`;
    document.body.appendChild(textBox);
}

//텍스트 박스 생성함수
function createTextBox(text) {
    const textBox = document.createElement('div');
    textBox.className = 'text-box';
    textBox.textContent = text;
    return textBox;
}
// 텍스트 박스 삭제함수
function hideHoverText() {
    const textBox = document.querySelector('.text-box');
    if (textBox) {
    textBox.remove();
    }
}

// 필터 작동 함수
//const buttons = document.querySelector('.filters-options');
//const leftArrow = document.querySelector('.prev');
//const rightArrow = document.querySelector('.next');
//
//let currentIndex = 0;
//const itemsToShow = 3;
//
//function showButtons() {
//    buttons.forEach((button, index) => {
//        if (index >= currentIndex && index < currentIndex + itemsToShow) {
//        button.style.display = 'inline-block';
//        } else {
//        button.style.display = 'none';
//        }
//    });
//}

// JavaScript
// const filters = document.querySelector('.filters');
// const leftArrow = document.querySelector('.left-more');

// // 초기에 보여질 필터 버튼 개수
// const initialVisibleButtons = 4;

// leftArrow.addEventListener('click', () => {
//   // 슬라이드 버튼 클릭 시 이벤트 처리
//   const allButtons = filters.children;
//   const firstHiddenButton = filters.querySelector('.hidden');

//   if (!firstHiddenButton) {
//     // 숨겨진 버튼이 없으면 슬라이드 더 보기
//     const numHiddenButtons = allButtons.length - initialVisibleButtons;
//     const buttonsToShow = Math.min(numHiddenButtons, initialVisibleButtons);
//     const newButtons = [...allButtons].slice(0, buttonsToShow);

//     // 새로운 버튼들을 보이도록 설정
//     newButtons.forEach((button) => button.classList.remove('hidden'));
//   } else {
//     // 이미 숨겨진 버튼이 있으면 슬라이드 숨기기
//     const buttonsToHide = [...allButtons].slice(0, initialVisibleButtons);

//     // 보여질 버튼만 남기고 나머지 버튼들을 숨김 처리
//     buttonsToHide.forEach((button) => {
//       if (!button.classList.contains('active')) {
//         button.classList.add('hidden');
//       }
//     });
//   }
// });