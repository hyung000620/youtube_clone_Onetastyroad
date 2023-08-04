//페이지 이동
function moveHome(){location.href= './index.html';}
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
let currentFilterIndex = 0;
const filtersPerPage = 5;

function showFilters() {
    const filterButtons = document.querySelectorAll('.filter-options');
    filterButtons.forEach((button, index) => {
        if (index >= currentFilterIndex && index < currentFilterIndex + filtersPerPage) {
            button.classList.remove('hidden');
            setTimeout(() => {
                button.style.transform = 'translateX(0)';
            }, index * 1);
        } else {
            button.classList.add('hidden');
            button.style.transform = 'translateX(-30px)';
        }
    });
}
function showNextFilters() {
    const totalFilters = document.querySelectorAll('.filter-options').length;
    if (currentFilterIndex + filtersPerPage < totalFilters) {
        currentFilterIndex += filtersPerPage;
        showFilters();
    }
}

function showPreviousFilters() {
    if (currentFilterIndex - filtersPerPage >= 0) {
        currentFilterIndex -= filtersPerPage;
        showFilters();
    }
}

showFilters();

// 모달창 구현
let isModalVisible = true;
function modalVisible(){
    let imageElement = document.querySelector(".iconbox.notificationsModal img");
    let modalElement = document.querySelector(".notifications-modal-background");
    const img = document.getElementById('notificationsModal');
    isModalVisible = !isModalVisible;
    if(isModalVisible){
        modalElement.style.display = "none";
    }else{
        modalElement.style.display = "block";
    }
}

// video.html 토글 사이드바 함수
let hamburger = true;

function toggleSideBar() {
    const [sideBar, sectionInner] = [document.querySelector('.side-bar'), document.getElementById('sectionInner')];

    hamburger = !hamburger;
    if (hamburger) {
        sideBar.style.display = 'none';
        sectionInner.style.setProperty('--sectionInner', '250px');
    } else {
        sideBar.style.display = 'block';
        sectionInner.style.setProperty('--sectionInner', '80px');
    }
}

let recognition;

// ----- 현재 브라우저에서 API 사용이 유효한가를 검증
function availabilityFunc() {
    // 현재 SpeechRecognition을 지원하는 크롬 버전과 webkit 형태로 제공되는 버전이 있으므로 둘 중 해당하는 생성자를 호출한다.
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = "ko"; // 음성인식에 사용되고 반환될 언어를 설정한다.
    recognition.maxAlternatives = 5; // 음성 인식결과를 5개 까지 보여준다.

    if (!recognition) {
        alert("현재 브라우저는 사용이 불가능합니다.");
    }
}
// --- 음성녹음을 실행하거나 종료하는 함수
function toggleRecord() {
    if (recognition && recognition.recording) {
        // 음성녹음이 이미 진행중인 경우 종료
        console.log("종료");
        recognition.stop(); // 음성인식을 중단하고 중단까지의 결과를 반환
    } else {
        // 음성녹음을 시작
        console.log("시작");

        // 클릭 시 음성인식을 시작한다.
        recognition.addEventListener("speechstart", () => {
            console.log("인식");
        });

        // 음성인식이 끝까지 이루어지면 중단된다.
        recognition.addEventListener("speechend", () => {
            console.log("인식2");
        });

        // 음성인식 결과를 반환
        // SpeechRecognitionResult 에 담겨서 반환된다.
        recognition.addEventListener("result", (e) => {
            document.getElementById("searchInput").value = e.results[0][0].transcript;
        });

        recognition.start();
    }
}

window.addEventListener("load", () => {
    availabilityFunc();
    document.querySelector(".mic").addEventListener("click", toggleRecord);
});