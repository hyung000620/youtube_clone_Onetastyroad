// 비디오 리스트 가져오기
async function getVideoList() {
    const response = await fetch('http://oreumi.appspot.com/video/getVideoList');
    const data = await response.json();
    return data;
}

// 비디오 정보 가져오기
async function getVideoInfo(videoId) {
    const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 채널 비디오 가져오기
async function getChannelVideo() {
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 채널 정보 가져오기
async function getChannelInfo() {
    const apiUrl = 'http://oreumi.appspot.com/channel/getChannelInfo?video_channel=oreumi';
    const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'accept': 'application/json'
    }
    });
    const data = await response.json();
    return data;
}

// 천 단위마다 (,) 써주는 함수
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 게시일 표시 (금일 대비 ~일 전)
function dateComparison(date) {
    const parsedDate = new Date(date.replace(/\//g, "-"));
    const milliSeconds = new Date() - parsedDate; 
    
    const seconds = milliSeconds / 1000
    if (seconds < 60) return `방금 전`
    const minutes = seconds / 60
    if (minutes < 60) return `${Math.floor(minutes)}분 전`
    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}시간 전`
    const days = hours / 24
    if (days < 7) return `${Math.floor(days)}일 전`
    const weeks = days / 7
    if (weeks < 5) return `${Math.floor(weeks)}주 전`
    const months = days / 30
    if (months < 12) return `${Math.floor(months)}개월 전`
    const years = days / 365
    return `${Math.floor(years)}년 전`
}


// index_home.html에서 화면 표시
async function displayHome() {
    const videoList = await getVideoList();
    const infoContainer = document.getElementById('videoList');
    let infoHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = videoInfoList[i];

        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        infoHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:100%; cursor:pointer;' onclick='${videoURL}'></img>
                <div style='display:flex;'>
                    <div style='width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                        <img src='img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                    </div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${thousandK(videoInfo.views)}</p>
                        <p>${dateComparison(videoInfo.upload_date)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 비디오 정보 추가
    infoContainer.innerHTML = infoHTML;
}

// index_video.html 에서 화면 표시
async function displayVideo(id) {
    const videoList = await getVideoList();
    let video = document.getElementById('videoInfo');
    let listContainer = document.getElementById('videolist');
    let listHTML = "";
    let videoHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);
    
    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = videoInfoList[i];

        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;
        let num = thousandK(videoInfo.views); //숫자값 format
        if (id == videoId){
            num = formatNumberWithCommas(num);
            videoHTML = `
            <div>
                <video controls style='width:100%;'>
                    <source src='${videoInfo.video_link}'>
                </video>
                <p style='font-size:1.125em; padding-top:1.25em; font-weight: 400;'>${videoInfo.video_title}</p>
                <div style='display:flex; align-items: center; justify-content: space-between; height:2.5em; padding-bottom:1.25em;'>
                    <div>
                        <p style='font-size:0.875em; color:#AAA; font-weight: 700;'>${num} views ${dateComparison(videoInfo.upload_date)}</p>
                    </div>
                    <div style='display:flex; align-items: center;'>
                        <img src='img/video/Liked.png' onclick="toggleLike(this)"><span class="likeCount" style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">170</span>
                        <img src='img/video/DisLiked.png'  onclick="toggleLike(this)"><span class="likeCount" style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">63</span>
                        <img src='img/video/Share.png'><span style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">SHARE</span>
                        <img src='img/video/Save.png'><span style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">SAVE</span>
                        <img src='img/video/More.png'>
                    </div>
                </div>
                <div style='display:flex;justify-content: space-between; padding:15px; border-top: 1px solid #303030;'>
                    <div style='display:flex;'>
                        <div style='width:3.125em; height: 3.125em; border-radius: 70%; overflow:hidden;'>
                            <img src='img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                        </div>
                        <div style='margin:10px'>
                            <p style="font-size:0.875em; font-weight: 400;">oreumi</p>
                            <p id='subsciribtors' style='font-size:0.75em; font-weight: 400; color:#AAAAAA'>구독자 80명</p>
                            <br>
                            <p style="font-size:0.875em; font-weight: 400;">안녕하세요.
                            이스트소프트입니다.<br>
                            이스트소프트는 정부의 디지털 인재양성 및 고용창출을 위한<br>
                            K-디지털 트레이닝 사업의 훈련 기관으로 선정되어,<br>
                            올해 마지막 [ESTsoft] 백엔드 개발자 부트캠프 오르미 3기 교육생 모집이 시작되었습니다. 🎉</p>
                        </div>
                    </div>
                    <div>
                        <img id='images' onclick='subcribe()' src='./img/channel/Subscribes-Btn.png' style='width:116px; height:36px; cursor:pointer;'>
                    </div>
                </div>
            </div>    
            `;
        }else{
            listHTML += `
            <div style="display:flex;">
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${thousandK(videoInfo.views)}</p>
                        <p>${dateComparison(videoInfo.upload_date)}</p>
                    </div>
                </div>
            </div>
        `;
        }
        
    } 
    // 선택된 비디오
    video.innerHTML = videoHTML;
    // 비디오 리스트 추가
    listContainer.innerHTML = listHTML;
   
}

// index_channel.html 에서 화면 표시
async function displayChannel() {
    const videoList = await getVideoList();
    const smalVideo = document.getElementById('smal-video')
    const infoContainer = document.querySelector('.xsmall-video');
    let smalHTML = "";
    let infoHTML = "";
    // 비디오 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.slice(0, 11).map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoInfoList.length; i++) {
        const videoInfo = videoInfoList[i];
        const videoId = videoInfo.video_id;

        // 비디오 정보를 표시할 문자열 생성
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;
        let num = thousandK(videoInfo.views);
        if (i===1){
            num = formatNumberWithCommas(num);
            smalHTML = `
            <div>
                <video controls style='width:500px'>
                    <source src='${videoInfo.video_link}'>
                </video>
            </div>
            <div>
                <p>${videoInfo.video_title}</p>
                <p>${num}views ${dateComparison(videoInfo.upload_date)}</p>
                <p>안녕하세요.
                이스트소프트입니다.<br>
                이스트소프트는 정부의 디지털 인재양성 및 고용창출을 위한<br>
                K-디지털 트레이닝 사업의 훈련 기관으로 선정되어,<br>
                올해 마지막 [ESTsoft] 백엔드 개발자 부트캠프 오르미 3기 교육생 모집이 시작되었습니다. 🎉</p>
            </div>
            `;
        }else{
            infoHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${thousandK(videoInfo.views)}</p>
                        <p>${dateComparison(videoInfo.upload_date)}</p>
                    </div>
                </div>
            </div>
        `;
        }
    }
    smalVideo.innerHTML = smalHTML;
    infoContainer.innerHTML = infoHTML;
}

// index_channel.html 에서 채널 배너 표시
async function channelTitleInfo(){
    try {
        const data = await getChannelInfo();
        const channelBannerImg = document.getElementById('channelBannerImg');
        const channelProfileImg = document.getElementById('channelProfileImg');
        const channelName = document.getElementById('channelName');
        const subscribersCount = document.getElementById('subscribersCount');
    
        // HTML 요소가 존재하는지 확인
        if (channelBannerImg && channelProfileImg && channelName && subscribersCount) {
          channelBannerImg.src = data.channel_banner;
          channelProfileImg.src = data.channel_profile;
          channelName.textContent = data.channel_name;
          subscribersCount.textContent = `구독자 ${data.subscribers}명`;
        } else {
          console.error('HTML 요소가 존재하지 않습니다.');
        }
    } catch (error) {
        console.error('처리 중 오류 발생:', error);
    }
}
channelTitleInfo();

//TODO: 검색 기능 구현
async function search() {
    const searchInput = document.getElementById('searchInput').value;
    const videoList = await getVideoList();
    const infoContainer = document.getElementById('videoList');
    let infoHTML = "";

    const filteredVideoList = videoList.filter((video) => {
        const title = video.video_title.toLowerCase();
        const channel = video.video_channel.toLowerCase();
        return title.includes(searchInput.toLowerCase()) || channel.includes(searchInput.toLowerCase());
    });

    // 검색결과 없을 시 "검색 결과가 없습니다." 로 나오는 기능 구현 추가
    if (filteredVideoList.length === 0) {
        infoContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
    }

    const videoInfoPromises = filteredVideoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < filteredVideoList.length; i++) {
        const videoId = filteredVideoList[i].video_id;
        const videoInfo = videoInfoList[i];


        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        infoHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div style='display:flex;'>
                    <div style='width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                        <img src='img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                    </div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${thousandK(videoInfo.views)}</p>
                        <p>${dateComparison(videoInfo.upload_date)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    infoContainer.innerHTML = infoHTML;
}

// home.html 검색 시 'enter키' 누르면 검색되는 기능 구현
// search-box -> input에 onkeyup
async function homeEnterkey() {
    if (window.event.keyCode == 13) {
        await search();
    }
}

// channel.html, video.html 검색 시 'enter키' 누르면 검색되는 기능 구현
// search-box -> input에 onkeyup
async function enterkey() {
    if (window.event.keyCode == 13) {
        location.href=`./index_home.html?search=${searchInput.value}`
        await search();
    }
}