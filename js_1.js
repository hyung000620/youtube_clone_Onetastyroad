/*
* 페이지 이동
*/
function moveHome(){location.href= './index_home.html';}
function moveVideo(){location.href= './index_video.html';}
function moveChannel(){location.href= './index_channel.html';}

// 댓글창 비우기
//TODO: 추후 html 완성 후에 재연결 필요
function commentClear(){
    let commentInput = document.getElementById("comment");
    commentInput.value = '';
}

// 댓글 작성
//TODO: 추후 html 완성 후에 재연결 필요
function addComment() {
    const commentInput = document.getElementById("comment").value;
    const viewComment = document.querySelector('.view-comment');
    const newCommentDiv = document.createElement("div");
    newCommentDiv.innerHTML = `
        <div class="profile-pic"><img src="img/video/User-Pic3.png" alt=""></div>
        <div class="view-area">
            <div class="comment-header">James Gouse <span> 방금 전</span></div>
            <div class="comment-text">${commentInput}</div>
            <div class="comment-toolbar">
                <img src="img/video/Liked.png" alt=""> 0
                <img src="img/video/DisLiked.png" alt=""> 0
                <p>REPLY</p>
            </div>
        </div>
    `;
    viewComment.appendChild(newCommentDiv);

    commentClear();
}

// 'enter키'로 댓글 작성
async function commentEnterkey() {
    if (window.event.keyCode == 13) {
        await addComment();
    }
}

// 구독버튼 토글
let toggle = true;
function subcribe(){
    const img = document.getElementById('images');
    const subs = document.getElementById('subsciribtors');
    toggle = !toggle;
    if(toggle){
        subs.textContent = "구독자 80명";
        img.src = 'img/channel/Subscribes-Btn.png';
    }else{
        subs.textContent = "구독자 81명";
        img.src = 'img/channel/subscribed-Btn.png';
    }
}


// 조회수 단위
//TODO: 추후 html 완성 후에 재연결 필요
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
// 사이드 바 토글
function sideBarToggle(){
    let sideBar = document.querySelector('.side-bar');
    let miniSideBar = document.querySelector('.mini-side-bar');

    hambuger = !hambuger;
    if(hambuger){ 
        sideBar.style.display = 'block';
        miniSideBar.style.display = 'none';
        sectionInner.style.marginLeft = '250px';
    }else{
        sideBar.style.display = 'none';
        miniSideBar.style.display = 'block';
        sectionInner.style.marginLeft = '80px';
    }
}

// 좋아요 버튼 토글

let isLiked = false;
let likeCount = 0;
let isDisliked = false;
let dislikeCount = 0;

// HTML 로드 후 초기값 설정
window.onload = function() {
    const likeCountElement = document.getElementById('likeCount');
    const dislikeCountElement = document.getElementById('dislikeCount');
    likeCount = parseInt(likeCountElement.textContent);
    dislikeCount = parseInt(dislikeCountElement.textContent);
};

function toggleLike() {
    if (isLiked) {
        likeCount--;
    } else {
        likeCount++;
    }
    isLiked = !isLiked;
    updateLikeCount();
}

function toggleDislike() {
    if (isDisliked) {
        dislikeCount--;
    } else {
        dislikeCount++;
    }
    isDisliked = !isDisliked;
    updateDislikeCount();
}

function updateLikeCount() {
    const likeCountElement = document.getElementById('likeCount');
    likeCountElement.textContent = likeCount;
}

function updateDislikeCount() {
    const dislikeCountElement = document.getElementById('dislikeCount');
    dislikeCountElement.textContent = dislikeCount;
}