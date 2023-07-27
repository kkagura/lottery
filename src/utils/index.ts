export function randomName(len: number = 16) {
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  var maxPos = chars.length;
  var str = "";
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}
