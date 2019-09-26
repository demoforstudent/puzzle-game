/*
Created by: Nguyen Anh Tuan
Last Modified by: Vu Dinh Khoi
Created on: 24/11/2014
Last Modified: 12/11/2015

Version 2
Modified by Vu Dinh Khoi
Description: thay đổi một số method của JavaScript mới & sử dụng jQuery
*/
var max = 16;
// Mảng lưu đường dẫn các hình
var imagePaths = ['images/1.png','images/2.png','images/3.png','images/4.png','images/5.png','images/6.png','images/7.png','images/8.png'];
var blank = 'images/blank.png'; // Đường dẫn hình nền			
var previousClick; // Vị trí hình mở lần đầu
var randomPosition = []; // Lưu vị trí ngẫu nhiên các hình
var imageStatus = []; // Lưu trạng thái các hình. -1: disable, 0: chưa click, 1: click một lần
var attempt = 0; // Cờ kiểm tra click chuột
var score = 0; // Điểm
var moves = 0; // Số lần mở hình

// Khởi tạo game mới
function newGame()
{ 	
	attempt = 0;
	score = 0;
	moves = 0;
	//document.getElementById('GameScore').innerHTML = score;
	//document.getElementById('GameMoves').innerHTML = moves;			
	document.getElementById("GameScore").textContent = score;
	document.getElementById("GameMoves").textContent = moves;
    
    // Load các hình nền
	for( var i = 0; i < max; i++)
	{
		document.images[i].src = blank;
	}				
	// Trạng thái các hình
	for (var i = 0; i < max; i++)
	{
		imageStatus[i] = 0; // Tình trạng các hình là chưa mở
	}
	// Khởi tạo 2 ô kề nhau cùng 1 index hình. Sau đó hoán vị ngẫu nhiên
	// randomPosition = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7]
	for( var i = 0; i < max/2; i++)
	{
		randomPosition[2*i] = randomPosition[2*i+1] = i;
	}
	// Hoán vị ngẫu nhiên các index hình
	for (var i = 0; i < max; i++)
	{	
		var temp, r;
		r = Math.round(Math.random()*(max-1)); // r=0..15
		temp = randomPosition[i]; // Do hoán vị nhiều lần, nên chỉ số i phải modulo max
		randomPosition[i] = randomPosition[r];
		randomPosition[r] = temp;
	}
}

function imageClicked()
{	
	// Lấy id của đối tượng image vừa click
	var i = this.id;
	// Nếu hình này đã mở rồi (trạng thái disable)
	if (imageStatus[i] == -1)
	{
		return;
	}				
	
	// Xử lý click hình lần đầu
	if (attempt == 0)
	{
		var imageIndex = randomPosition[i]; // đường dẫn hình
		this.src = imagePaths[imageIndex];
		//document.getElementById('GameMoves').innerHTML = ++moves; // Lưu ý: tăng move rồi gán (khác với moves++)
		document.getElementById("GameMoves").textContent = ++moves;
		previousClick = i;
		attempt = 1;
		return;
	}
	
	// Xử lý click hình lần 2
	if(attempt == 1)
	{					
		if (i != previousClick)
		{
			var imageIndex = randomPosition[i];
			this.src = imagePaths[imageIndex];
			
			if (randomPosition[i] != randomPosition[previousClick]) // 2 hình khác nhau
			{
				setTimeout(function()
					{
					document.getElementById(previousClick).src = blank;
					document.getElementById(i).src = blank;
					}, 200);
				// Tăng số lần mở thử
				imageStatus[previousClick]++;
				imageStatus[i]++;
				changePosition(previousClick);
				changePosition(i);
			}
			else // 2 hình giống nhau
			{
				//document.getElementById('GameScore').innerHTML = ++score;
			    document.getElementById("GameScore").textContent = ++score;
			    imageStatus[previousClick] = imageStatus[i] = -1; // 2 hình này đã mở rồi nên disable
				if (score == max/2)
				{
					alert("Congratulation. You win!!!");
				}
			}
			//document.getElementById('GameMoves').innerHTML = ++moves;
			document.getElementById("GameMoves").textContent = ++moves;
			attempt = 0;
		}
		else
		{
			return;
		}			
	}			
}

// Hàm initialize() được gọi một lần duy nhất khi load form
function initialize()
{
	for (var i = 0; i < max; i++)
	{			
		var x = document.getElementById(i);
		x.width = 100;
		x.height = 100;
		x.src = blank;
		x.addEventListener("click", imageClicked);
	}
	newGame();
}
// Thay đổi vị trí nếu các hình mở nhiều lần. Nhằm tạo độ khó cho game
function changePosition(pos)
{
	if (imageStatus[pos] >= 3) // Đã mở thử quá 3 lần
	{
		var j = max;
		while (j > 0)
		{
			j--;
			if (imageStatus[j] != -1)
			{
				var temp = randomPosition[j];
				randomPosition[j] = randomPosition[pos];
				randomPosition[pos] = temp;
				imageStatus[j] = 0;
				imageStatus[pos] = 0;
				break;
			}
		}
	}
}