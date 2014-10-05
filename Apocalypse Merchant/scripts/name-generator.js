var first = ["New", "Old", "Little", "St.", "Fort", "Santa", "Peaceful", "Castle", "Bright", "Bleak", "Second", "Black", "Dark", "Radiant", "Dire", "Happy", "North", "East", "South", "West", "Sleepy", "Foggy", "Clouded"],
    middle01 = ["Germ", "It", "Fra", "Home", "York", "Ber", "Gard", "Kent", "Alex", "Richard", "Miram", "Ham", "Chic", "Phoen", "Dal", "Austin", "Colum", "Charl", "De", "Memph", "Bost", "Seat", "Port", "Tucs", "Fres", "Sacram", "Mes", "Atl", "Om", "Miam", "Tuls", "Oakl", "Clevel", "Minneap", "Wich", "Arl", "Anah", "Solit", "Alas", "Ariz", "Arkan", "Calif", "Color", "Connect", "Col", "Flor", "Georg", "Haw", "Idah", "Illin", "Ind", "Iow", "Kans", "Kent", "Louis", "Main", "Maryl", "Massach", "Mich", "Minn", "Miss", "Miss", "Mont", "Neb", "Nev", "Hamp", "Jers", "Mex", "Oh", "Okl", "Oreg", "Penn", "Rhod", "Car", "Dak", "Tenn", "Tex", "Ut", "Verm", "Wash", "West", "Virg", "Wisc", "Wyom", "Bath", "Birm", "Bradf", "Bright", "Hov", "Brist", "Cambr", "Canterb", "Carl", "Chest", "Chich", "Covent", "Derb", "Durh", "El", "Exet", "Glouc", "Heref", "Kingst", "Lanc", "Leed", "Leic", "Lichf", "Linc", "Liverp", "Lond", "Manch", "Newc", "Norw", "Not", "Ox", "Peter", "Plym", "Portsm", "Prest", "Rip", "Sal", "Sal", "Shef", "South", "Alb", "Stok", "Sund", "Trur", "Wak", "Well", "West", "Winch", "Wolverh", "Worc", "Aberd", "Dund", "Edinb", "Glasg", "Invern", "Stirl", "Bang", "Card", "Newp", "David", "Swans", "Arm", "Belf", "Lond", "Derr", "Lisb", "New"],
    middle02 = ["any", "aly", "ance", "ead", "lin", "en", "andria", "son", "oburg", "ago", "ix", "las", "us", "otte", "is", "on", "and", "on", "ento", "anta", "ar", "a", "aha", "i", "a", "olis", "ita", "ington", "eim", "ude", "ing", "onsin", "inia", "ington", "ont", "ah", "as", "essee", "ota", "olina", "e", "ania", "on", "ahoma", "io", "ico", "ey", "ada", "aska", "ouri", "ona", "ippi", "as", "ornia", "ado", "icut", "esota", "umbia", "igan", "ida", "ia", "etts", "ine", "aii", "o", "ois", "iana", "ucky", "y", "urn", "ast", "agh", "ea", "ort", "iff", "or", "ing", "ess", "ow", "ord", "ingham", "ol", "idge", "ury", "isle", "er", "ester", "am", "eter", "aster", "ield", "oln", "ool", "astle", "ich", "outh", "isbury", "field", "ampton", "ans", "erland", "een", "inster"],
    post = ["ville", "City", "Village", "town", "shire", "Falls", "at the", "Island", "upon", "Valley"],
    last = ["Hills", "Mountain", "River", "Lake", "Cliffs", "Tower", "Shore", "Hill", "Peak", "Valley", "Stones"];

function generateNames(numberOfNames){
  var preFix,postFix,done=false; //booleans
  var currentName ="",s;
  var result = [];
  var temp;
  for(var i=0;i<numberOfNames;i++){
    while(!done){
      preFix = (Math.floor(Math.random()*15))<3;
      postFix = (Math.floor(Math.random()*15))<3;
      if (preFix){
        currentName+=first[Math.floor(Math.random()*first.length)]+" ";
      }
      currentName+=middle01[Math.floor(Math.random()*middle01.length)];
      currentName+=middle02[Math.floor(Math.random()*middle02.length)];
      if(postFix){
        s = post[Math.floor(Math.random()*post.length)];
        if(s[0].toLowerCase != s[0]){
          currentName+=" ";
        }
        currentName+=s;
        if(s=="at the"||s == "upon"){
          currentName += " "+last[Math.floor(Math.random()*last.length)];
        }
      }
      done = true;
      for(var i=0; i<result.length; i++ ){
        if(result[i] == currentName) {
          done = false;
          currentName="";
        }
      }
    }
    result.push(currentName);
    currentName="";
    done=false;
  }
  return result;
}