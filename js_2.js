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

// 채널 정보 가져오기
async function getChannelVideo() {
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}


// 아래는 시험용으로 작성한 코드이므로 참고용으로 쓰시고 - Fixed
// Html에 해당하는 id 추가, for문 수정 부탁드립니다 - - Fixed
// 비디오 정보를 이미지와 함께 표시
// index_home.html 에서 화면 표시
async function displayHome() {
    const videoList = await getVideoList();
    const infoContainer = document.getElementById('videoList');

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = await getVideoInfo(videoId);
        const channelInfo = await getChannelVideo();

        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        const infoHTML = `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div style='display:flex;'>
                    <div style='width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                        <img src='/img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                    </div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${videoInfo.views}</p>
                        <p>${videoInfo.upload_date}</p>
                    </div>
                </div>
                
            </div>
        `;

        // 비디오 정보 추가
        infoContainer.innerHTML += infoHTML;
    }
}
// index_video.html 에서 화면 표시
async function displayVideo(id){
    const videoInfo = await getVideoInfo(id);
    const infoContainer = document.getElementById('videoInfo');

    const infoHTML = `
        <video controls style='width:800px'>
            <source src='${videoInfo.video_link}'>
        </video>    
    `;

    infoContainer.innerHTML = infoHTML;
}
// index_channel.html 에서 화면 표시
async function displayChannel(){
    const videoList = await getVideoList();
    const infoContainer = document.querySelector('.playlist');

    for (let i = 0; i < 10; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = await getVideoInfo(videoId);
        const channelInfo = await getChannelVideo();

        // 비디오 정보를 표시할 문자열 생성
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        const infoHTML = `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${videoInfo.views}</p>
                        <p>${videoInfo.upload_date}</p>
                    </div>
                </div>
                
            </div>
        `;

        // 비디오 정보 추가
        infoContainer.innerHTML += infoHTML;
    }
}
// 페이지가 로드되면 비디오 정보를 가져와서 표시
// document.addEventListener('DOMContentLoaded', () => {
//     displayVideos().catch(error => {
//         console.error('유튜브 정보를 가져오는데 실패했습니다. ', error);
//     });
// });
