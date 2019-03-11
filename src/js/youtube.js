/* global d3 */

function resize() {}

function init() {
	var youtubeUS = [["YoungBoy","2.49B"], ["XXXTentacion","2.04B"], ["Drake","2B"], ["Ozuna","1.52B"], ["Cardi B","1.5B"], ["Bad Bunny","1.46B"], ["Post Malone","1.45B"], ["Lil Baby","1.44B"], ["Eminem","1.32B"], ["Kodak Black","1.19B"]];
	var spotifyUS = [["Drake",""], ["Post Malone",""], ["XXXTentacion",""], ["Travis Scott",""], ["Khalid",""]];
	var youtubeGlobal = [["Ozuna","10.7B"], ["J Balvin","8.51B"], ["Bad Bunny","8.48B"], ["Alka Yagnik","6.97B"], ["Neha Kakkar","6.65B"], ["Ed Sheeran","6.24B"], ["Nicky Jam","5.97B"], ["Udit Narayan","5.84B"], ["BTS","5.54B"], ["Daddy Yankee","5.17B"]];
	var spotifyGlobal = [["Drake","8.2B"], ["Post Malone","*"], ["XXXTentacion","*"], ["J. Balvin","3B"], ["Ed Sheeran","*"]];

	var data = [
		{"geo":"US","data":[{"platform":"YouTube","values":youtubeUS},{"platform":"Spotify","values":spotifyUS}]},
		{"geo":"Global","data":[{"platform":"YouTube","values":youtubeGlobal},{"platform":"Spotify","values":spotifyGlobal}]}
	]

	var chart = d3.select(".chart-youtube");

	var geoSections = chart.selectAll("div")
		.data(data)
		.enter()
		.append("div")
		.attr("class","chart-youtube-geo")
		;

	geoSections.append("p")
		.attr("class","chart-youtube-geo-title")
		.text(function(d){
			return d.geo + " Ranking";
		})

	var platformColumn = geoSections.append("div")
		.attr("class","chart-youtube-geo-ranking-container")
		.selectAll("div")
		.data(function(d){
			return d.data
		})
		.enter()
		.append("div")
		.attr("class","chart-youtube-geo-platform-wrapper");

	platformColumn.append("p")
		.attr("class","chart-youtube-geo-platform")
		.text(function(d){
			return d.platform;
		})

	var platformRow = platformColumn
		.append("div")
		.attr("class","chart-youtube-geo-ranking-wrapper")
		.selectAll("div")
		.data(function(d){
			return d.values
		})
		.enter()
		.append("div")
		.attr("class","chart-youtube-geo-ranking-row")
		;

	platformRow.append("p")
		.attr("class","artist-name")
		.text(function(d){
			return d[0];
		})

	platformRow.append("p")
		.attr("class","artist-counts")
		.text(function(d){
			var artist = d[0];
			var topArtist = d3.select(this.parentNode.parentNode).datum().values[0][0];
			if(artist == topArtist){
				return d[1] + " streams";
			}
			return d[1];

		})





}

export default { init, resize };
