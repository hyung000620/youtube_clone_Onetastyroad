/*
* 페이지 이동
*/
function moveHome(){location.href= './index_home.html';}
function moveVideo(){location.href= './index_video.html';}
function moveChannel(){location.href= './index_channel.html';}

//댓글창 비우기
//TODO: 추후 html 완성 후에 재연결 필요
function commentClear(){
    let commentInput = document.getElementById("comment");
    commentInput.value = '';
}

//댓글 작성
//TODO: 추후 html 완성 후에 재연결 필요
function addComment() {
    let commentInput = document.getElementById("comment").value;
    let commentBody = document.getElementById("commentBody");

    if (commentInput.trim() === "") {
        alert("댓글을 입력해주세요.");
        return;
    }
    let timeText = "방금 전";
    commentBody.innerHTML += `<p><span>${commentInput}</span> <span>${timeText}</span></p>`;

    commentClear();
}

// 좋아요 기능
//TODO: 추후 html 완성 후에 재연결 필요
let isLiked = false;

function like(){
    let likeBtn = document.querySelector('.likeBtn');
    if (isLiked) {
        likeBtn.innerText = '좋아요';
        likeBtn.style.backgroundColor = 'red';
    }else {
        likeBtn.innerText = '좋아요 취소';
        likeBtn.style.backgroundColor = 'gray';
    }
    isLiked = !isLiked;
}

// 구독 기능
//TODO: 추후 html 완성 후에 재연결 필요
let isSubscribed = false;

function toggleSubscription() {
    let subscribeBtn = document.querySelector('.subscribeBtn');

    if (isSubscribed) {
        subscribeBtn.innerText = '구독하기';
        subscribeBtn.style.backgroundColor = 'red';
    }else {
        subscribeBtn.innerText = '구독중';
        subscribeBtn.style.backgroundColor = 'gray';
    }
    isSubscribed = !isSubscribed;
}

// 구독버튼 토글
const img = document.getElementById('images');
let toggle = true;
img.addEventListener('click', function(){
    toggle = !toggle;
    if(toggle){
        img.src = 'img\\Subscribes-Btn.png';
    }else{
        img.src = 'img\\subscribed-Btn.png';
    }
})


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
