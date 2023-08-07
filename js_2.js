const APIURL = "https://oreumi.appspot.com";

// 비디오 리스트 가져오기
async function getVideoList() {
    const response = await fetch(`${APIURL}/video/getVideoList`);
    const data = await response.json();
    return data;
}

// 비디오 정보 가져오기
async function getVideoInfo(videoId) {
    const apiUrl = `${APIURL}/video/getVideoInfo?video_id=${videoId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 채널 비디오 가져오기
async function getChannelVideo(channelId) {
    const apiUrl = `${APIURL}/channel/getChannelVideo?video_channel=${channelId}`;
    const response = await fetch(apiUrl, {method: 'POST',headers: {'accept': 'application/json'}});
    const data = await response.json();
    return data;
}

// 채널 정보 가져오기
async function getChannelInfo(channelId) {
    const apiUrl = `${APIURL}/channel/getChannelInfo?video_channel=${channelId}`;
    const response = await fetch(apiUrl, {method: 'POST',headers: {'accept': 'application/json'}});
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

// index.html에서 화면 표시
async function displayHome() {
    const videoList = await getVideoList();
    const infoContainer = document.getElementById('videoList');
    let infoHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);
     // 채널 정보를 병렬로 가져오는 프로미스 배열 생성
     const channelInfoPromises = videoInfoList.map((videoInfo) => getChannelInfo(videoInfo.video_channel));
     const channelInfoList = await Promise.all(channelInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = videoInfoList[i];
        const profile = channelInfoList[i];
        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html?cId=${profile.channel_name}"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        infoHTML += `
        <div>
        <img src='${videoInfo.image_link}' style='width:100%; cursor:pointer; border-radius:3%;' onclick='${videoURL}'></img>
            <div style='display:flex;'>
                <div style='margin-top:0.5em; width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                    <img src='${profile.channel_profile}' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                </div>
                <div>
                    <p style='margin-top:0.5em;'>${videoInfo.video_title}</p>
                    <p class="viewAndDate">${videoInfo.video_channel}</p>
                    <p class="viewAndDate">${thousandK(videoInfo.views)} · ${dateComparison(videoInfo.upload_date)}</p>
                </div>
            </div>
        </div>
        `;
    }

    // 비디오 정보 추가
    infoContainer.innerHTML = infoHTML;
}
const videoInfoCache = new Map();
const channelInfoCache = new Map();

// 캐싱된 비디오 정보를 가져오는 함수
async function getCachedVideoInfo(videoId) {
    if (videoInfoCache.has(videoId)) {
        return videoInfoCache.get(videoId);
    } else {
        const videoInfo = await getVideoInfo(videoId);
        videoInfoCache.set(videoId, videoInfo);
        return videoInfo;
    }
}
// 캐싱된 채널 정보를 가져오는 함수
async function getCachedChannelInfo(channelId) {
    if (channelInfoCache.has(channelId)) {
        return channelInfoCache.get(channelId);
    } else {
        const channelInfo = await getChannelInfo(channelId);
        channelInfoCache.set(channelId, channelInfo);
        return channelInfo;
    }
}
// index_video.html 에서 화면 표시
async function displayVideo(id) {
    const [videoInfoList, currentVideoInfo] = await Promise.all([
        getVideoList(),
        getCachedVideoInfo(id),
    ]);

    let video = document.getElementById('videoInfo');
    let listContainer = document.getElementById('videolist');
    let tagContainer = document.querySelector('.content-top-menu');
    let listHTML = "";
    let videoHTML = "";
    let tagHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    let tagList = currentVideoInfo.video_tag;

    let targetTagList = currentVideoInfo.video_tag; //현재 비디오 태그
    let targetVideoId = currentVideoInfo.video_id;
    let channelName = currentVideoInfo.video_channel;
    let currentChannelInfo = await getCachedChannelInfo(channelName);
    let num = thousandK(currentVideoInfo.views); //숫자값 format
    let channelURL = `location.href="./index_channel.html?=${channelName}"`;
    videoHTML = `
            <div>
                <video controls autoplay style='width:100%;'>
                    <source src='${currentVideoInfo.video_link}'>
                </video>
                <p style='font-size:1.125em; padding:1.25em 0em; font-weight: 400;'>${currentVideoInfo.video_title}</p>
                <div style='display:flex; align-items: center; justify-content: space-between; height:2.5em; padding-bottom:1.25em;'>
                    <div>
                        <p style='font-size:0.875em; color:#AAA; font-weight: 700;'>${num} views ${dateComparison(currentVideoInfo.upload_date)}</p>
                    </div>
                    <div style='display:flex; align-items: center;'>
                        <img src='img/video/Liked.png' onclick="toggleLike(this)"><span class="likeCount" style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">170</span>
                        <img src='img/video/DisLiked.png'  onclick="toggleLike(this)"><span class="likeCount" style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">63</span>
                        <img src='img/video/Share.png'><span style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">SHARE</span>
                        <img src='img/video/Save.png'><span style="margin: 0em 1.25em 0em 0.563em; font-weight: 700;">SAVE</span>
                        <img src='img/video/More.png'>
                    </div>
                </div>
                <div style='display:flex;justify-content: space-between; padding:1em 1em 0em 1em; border-top: 1px solid #303030;'>
                    <div style='display:flex'>
                        <div style='width:50px; height: 50px; border-radius: 70%; overflow:hidden;'>
                            <img src='${currentChannelInfo.channel_profile}' style='width:50px; height:50px; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                        </div>
                        <div>
                            <p style="font-size:0.875em; font-weight: 400;">${currentChannelInfo.channel_name}</p>
                            <p id='subscribersCount' style='font-size:0.75em; font-weight: 400; color:#AAAAAA'>구독자 ${currentChannelInfo.subscribers}명</p>
                        </div>
                    </div>
                    <br>
                    <div>
                        <img id='images' onclick='subcribe()' src='./img/channel/Subscribes-Btn.png' style='width:116px; height:36px; cursor:pointer;'>
                    </div>
                </div>
                <div style='margin:1em'>
                    <p style="font-size:0.875em; font-weight: 400;">안녕하세요.
                    이스트소프트입니다.<br>
                    이스트소프트는 정부의 디지털 인재양성 및 고용창출을 위한<br>
                    K-디지털 트레이닝 사업의 훈련 기관으로 선정되어,<br>
                    올해 마지막 [ESTsoft] 백엔드 개발자 부트캠프 오르미 3기 교육생 모집이 시작되었습니다.🎉</p>
                </div
            </div>  
            `;
    
    for (let i=0; i<tagList.length; i++){
        let tag = tagList[i];
        tagHTML += `<button>${tag}</button>`;
    }
    const similarityCache = new Map();
    async function getSimilarity(firstWord, secondWord) {
        const cacheKey = `${firstWord}-${secondWord}`;
        if (similarityCache.has(cacheKey)) {
            return similarityCache.get(cacheKey);
        }

        const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/WordRel";
        const access_key = "208ce248-aecc-4898-8d47-99896bef4e62";

        let requestJson = {
            argument: {
                first_word: firstWord,
                second_word: secondWord,
            },
        };

        let response = await fetch(openApiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: access_key,
            },
            body: JSON.stringify(requestJson),
        });
        let data = await response.json();
        const distance = data.return_object["WWN WordRelInfo"].WordRelInfo.Distance;
        similarityCache.set(cacheKey, distance); // 결과를 캐시에 저장
        return distance;
    }
    
    async function calculateVideoSimilarities(videoList, targetTagList) {
        let filteredVideoList = [];
    
        for (let video of videoList) {
            let totalDistance = 0;
            let promises = [];
    
            for (let videoTag of video.video_tag) {
                for (let targetTag of targetTagList) {
                    if (videoTag == targetTag) {
                        promises.push(0);
                    } else {
                        promises.push(getSimilarity(videoTag, targetTag));
                    }
                }
            }
    
            let distances = await Promise.all(promises);
    
            for (let distance of distances) {
                if (distance !== -1) {
                    totalDistance += distance;
                }
            }
    
            if (totalDistance !== 0) {
                if (targetVideoId !== video.video_id) {
                    filteredVideoList.push({ ...video, score: totalDistance });
                }
            }
            if (filteredVideoList.length >= 5) {
                break;            
            }
        }
    
        filteredVideoList.sort((a, b) => a.score - b.score);
    
        filteredVideoList = filteredVideoList.map((video) => ({
            ...video,
            score: 0,
        }));
    
        return filteredVideoList;
    }

    // function calculateVideoSimilarities(videoList, targetTagList) {
    //     const filteredVideoList = [];
    //     const targetTagSet = new Set(targetTagList);
    
    //     const idfMap = new Map();
    //     const totalVideos = videoList.length;
    
    //     for (const video of videoList) {
    //         const videoTagSet = new Set(video.video_tag);
    //         for (const tag of videoTagSet) {
    //             if (idfMap.has(tag)) {
    //                 idfMap.set(tag, idfMap.get(tag) + 1);
    //             } else {
    //                 idfMap.set(tag, 1);
    //             }
    //         }
    //     }
    
    //     for (const video of videoList) {
    //         const videoTagSet = new Set(video.video_tag);
    //         let similarity = 0;
    
    //         for (const tag of videoTagSet) {
    //             if (targetTagSet.has(tag)) {
    //                 const tf = 1 / videoTagSet.size;
    //                 const idf = Math.log(totalVideos / (idfMap.get(tag) || 1)) + 1;
    //                 similarity += tf * idf;
    //             }
    //         }
    
    //         if (similarity > 0) {
    //             filteredVideoList.push({ ...video, score: similarity });
    //         }
    //     }
    
    //     filteredVideoList.sort((a, b) => b.score - a.score);
    
    //     const top5Videos = filteredVideoList.slice(0, 5);
    //     const finalVideoList = top5Videos.map((video) => ({ ...video, score: 0 }));
    
    //     return finalVideoList;
    // }
    const filteredVideoList = await calculateVideoSimilarities(videoInfoList,targetTagList);
    for (let i=0; i<filteredVideoList.length; i++){
        let video = filteredVideoList[i];
        let videoInfo = await getCachedVideoInfo(video.video_id);
        console.log(video.video_id)
        let videoURL = `location.href="./index_video.html?id=${video.video_id}"`;
        listHTML += `
        <div style="display:flex;">
            <img src='${videoInfo.image_link}' style='width:60%;cursor:pointer;' onclick='${videoURL}'></img>
            <div>
                <div>
                    <p>${video.video_title}</p>
                    <p class="viewAndDate">${video.video_channel}</p>
                    <p class="viewAndDate">${thousandK(video.views)} · ${dateComparison(video.upload_date)}</p>
                </div>
            </div>

        </div>`;
    } 
    
    // 선택된 비디오
    video.innerHTML = videoHTML;
    // 비디오 리스트 추가
    listContainer.innerHTML = listHTML;
    // 태그 추가
    tagContainer.innerHTML = tagHTML;
}

// index_channel.html 에서 화면 표시
async function displayChannel(id) {
    const channelBannerImg = document.getElementById('channelBannerImg');
    const channelProfileImg = document.getElementById('channelProfileImg');
    const channelName = document.getElementById('channelName');
    const subscribersCount = document.getElementById('subscribersCount');
    const videoList = await getChannelVideo(id);
    const channelInfo = await getChannelInfo(id); 
    const smalVideo = document.getElementById('smal-video')
    const infoContainer = document.querySelector('.xsmall-video');
    let smalHTML = "";
    let infoHTML = "";
    
    // 비디오 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
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
            <div class="player">
            <video controls autoplay style='width:100%'>
                <source src='${videoInfo.video_link}'>
            </video>
        </div>
        <div class="video-desc">
            <p class="video-desc-video">${videoInfo.video_title}</p>
            <p class="video-desc-date">${num} views ㆍ ${dateComparison(videoInfo.upload_date)}</p>
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
                <img src='${videoInfo.image_link}' style='width:100%;cursor:pointer;border-radius:3%;' onclick='${videoURL}'></img>
                <div>
                <div>
                    <p class="marginBelowVideo">${videoInfo.video_title}</p>
                    <p class="viewAndDate">${videoInfo.video_channel}</p>
                    <p class="viewAndDate">${thousandK(videoInfo.views)} · ${dateComparison(videoInfo.upload_date)}</p>
                </div>
                </div>
            </div>
        `;
        }
    }

    channelBannerImg.src = channelInfo.channel_banner;
    channelProfileImg.src = channelInfo.channel_profile;
    channelName.textContent = channelInfo.channel_name;
    subscribersCount.textContent = `구독자 ${channelInfo.subscribers}명`;
    smalVideo.innerHTML = smalHTML;
    infoContainer.innerHTML = infoHTML;
    
}

//검색 기능 구현
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
            <img src='${videoInfo.image_link}' style='width:100%; cursor:pointer;border-radius:3%;' onclick='${videoURL}'></img>
            <div style='display:flex;'>
                <div style='margin-top:0.5em; width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                    <img src='img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                </div>
                <div>
                    <p style='margin-top:0.5em;'>${videoInfo.video_title}</p>
                    <p class="viewAndDate">${videoInfo.video_channel}</p>
                    <p class="viewAndDate">${thousandK(videoInfo.views)} · ${dateComparison(videoInfo.upload_date)}</p>
                </div>
            </div>
        </div>
        `;
    }

    infoContainer.innerHTML = infoHTML;
}
// enterkey
async function enterkey(searchInput) {
    if (window.event.keyCode == 13) {
        if (searchInput) {
            location.href = `./index.html?search=${searchInput.value}`;
        }
        await search();
    }
}