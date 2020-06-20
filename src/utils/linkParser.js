export default function parser(link) {
    // Check if the link is empty
    if(link.length == 0) {
        throw new Error("input must not be of zero length")
    }
    // Split parts by comma 
    let parts = link.split(',')
    // Star JSON
    let links = {}
    // Parse each part into a named link
    parts.forEach(element => {
        // Split each part into a named semicolon
        let section = element.split(';')
        // Check if the section has two parts (link and rel)
        if (section.length != 2) {
            throw new Error("section could not be split on ';'")
        }
        // Remove the blanks and the <https://api.github.com/ >
        let url = section[0].replace(/<https:\/\/api.github.com\/(.*)>/, '$1').trim()
        // Remove the blanks and the rel=
        let name = section[1].replace(/rel="(.*)"/, '$1').trim()
        // Fill the JSON with the key being the rel and the value being the link
        links[name] = url
    });
    return links
}
    