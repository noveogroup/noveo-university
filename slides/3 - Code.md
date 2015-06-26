
## Code

```js
window.onload = function() {
  var linkWithAlert = document.getElementById("alertLink");
  linkWithAlert.onclick = function() {
    return confirm('Вы уверены?'); 
  };
};
```
