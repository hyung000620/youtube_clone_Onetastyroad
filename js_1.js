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
let commentCount = 2;
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
async function commentEnterkey() {
    if (window.event.keyCode == 13) {
        let commentInput = document.getElementById("comment");
        if(commentInput.value.length === 0){
            return;
        }
        await addComment();
    }
}

// 댓글 버튼 보이기, 취소 버튼으로 숨기기
function showCommentBtn() {
    const commentBtn = document.getElementById('commentBtn');
    commentBtn.style.display = 'inline-block';
}
function hideCommentBtn() {
    const commentBtn = document.getElementById('commentBtn');
    commentBtn.style.display = 'none';
}

// 댓글 input값 비었을때 버튼 비활성화
function commentAction(){
    let commentInput = document.getElementById("comment");
    let commentSubmit = document.getElementById("commentSubmit");
    
    if(commentInput.value.length == 0){
        commentSubmit.disabled = true;
    }else{
        commentSubmit.disabled = false;
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
    let sectionInner = document.getElemetById('sectionInner');

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
function toggleLike(likeImage) {
    const likeCountElement = likeImage.nextElementSibling;
    const likeCount = parseInt(likeCountElement.textContent);

    if (likeImage.classList.contains('liked')) {
        likeImage.classList.remove('liked');
        likeCountElement.textContent = likeCount - 1;
    } else {
        likeImage.classList.add('liked');
        likeCountElement.textContent = likeCount + 1;
    }
}