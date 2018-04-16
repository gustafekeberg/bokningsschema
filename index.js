var scrape = require('scrapeit')
var url = process.argv[2]
var searchString = process.argv[3]

var selection = []

scrape(url, function (err, o, dom) {

	o("table table").forEach(function (table) {

		var children = table.children
		children.forEach(function (child) {
			var childData = child.children[0].children[1] // the data of this child

			if (childData && childData.raw.search(searchString) != -1) {
				var obj = {
					room: "",
					bookings: []
				}
				obj.room = childData.raw.trim()
				var hasData = children[1].children[0].children[0].children[1] // this is where we find our data, if it's present
				if (hasData) {
					children.forEach((bookedEntry, i) => {
						if (i > 0) {
							var currentData = bookedEntry.children[0].children[0].children
							obj.bookings.push({
								time: currentData[1].raw.trim(),
								name: currentData[9].raw.trim()
							})
						}
					})
				}
				selection.push(obj)
			}
		})
	})
	logger(selection)
})

function logger(data) {
	console.log(JSON.stringify(data, null, 4))
	
}