'use strict';
let currentState = Array(8).fill(Array(5));
console.log(currentState.slice());
let selectedGroup;

const getInitState = (group = '') => {
  const groupName = group === '' ? selectedGroup : group;
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/storage?group=' + groupName;
  xhr.open('GET', url, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
};

const addGroup = _ => {
  const name = prompt('Group name: ', 'TI-52');
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/group';
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    data: [[]],
    group: name
  }));
  selectedGroup = name;
  let option = document.createElement('option');
  option.value = name;
  option.innerText = name;
  $('#group_select').get(0).appendChild(option);

  $('#group_select option').each((i, el) => {
    if (el.value === selectedGroup) {
      el.selected = true;
    } else {
      el.selected = false;
    }
  });
  rewriteDOMForView(getInitState());
};

const postState = data => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/group';
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(data);
  xhr.send(JSON.stringify({
      data: data,
      group: selectedGroup
    })
  );
};

const saveState = _ => {
  $('.btn.btn--edit').removeClass('btn--hide');
  $('.btn.btn--save').addClass('btn--hide');
  $('.btn.btn--cancel').addClass('btn--hide');

  currentState = [];

  $('.table__row-wrapper').each((i, cell) => {
    let row = [...cell.children];
    let res = [];
    row.forEach((el, j) => {
      if (el.children.length === 2) {
        res[j] = el.children[0].value === el.children[1].value ? {
          'top': el.children[0].value,
          'bottom': el.children[0].value
        } : {
          'top': el.children[0].value,
          'bottom': el.children[1].value
        };
      } else {
        res[j] = el.children[0].value === '' ? {
          'top': el.children[1].value,
          'bottom': el.children[1].value
        } : {
          'top': el.children[0].value,
          'bottom': el.children[0].value
        };
      }
    });
    currentState.push(res);
  });
  postState(currentState.slice());
  rewriteDOMForView(getInitState());
};

const backUp = _ => {
  $('.btn.btn--edit').removeClass('btn--hide');
  $('.btn.btn--save').addClass('btn--hide');
  $('.btn.btn--cancel').addClass('btn--hide');
  rewriteDOMForView(getInitState());
};

const getAllGroup = _ => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/group';
  xhr.open('GET', url, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
};

window.onload = () => {
  let groupsName = getAllGroup();
  groupsName.forEach(el => {
    let option = document.createElement('option');
    option.value = el;
    option.innerText = el;
    $('#group_select').get(0).appendChild(option);
  });
  $('#group_select option')[0].selected = true;
  selectedGroup = $('#group_select option')[0].value;
  $('#group_select').change(_ => {
    console.log('here');
    $('#group_select option').each((i, el) => {
      if (el.selected) {
        selectedGroup = el.value;
      }
    });
    rewriteDOMForView(getInitState());
  });
  rewriteDOMForView(getInitState());
};
const rewriteDOMForEdit = _ => {
  $('.btn.btn--edit').addClass('btn--hide');
  $('.btn.btn--save').removeClass('btn--hide');
  $('.btn.btn--cancel').removeClass('btn--hide');

  $('.table__row-wrapper .table__cell').each((i, el) => {
    let contentTop = '',
      contentBottom = '';
    if (el.children.length > 1) {
      contentTop = el.children[0].innerText;
      contentBottom = el.children[1].innerText;
      el.innerHTML = '';
      let inputTop = document.createElement('input');
      inputTop.className = 'table__input';
      inputTop.value = contentTop;
      el.appendChild(inputTop);
      let inputBottom = document.createElement('input');
      inputBottom.className = 'table__input';
      inputBottom.value = contentBottom;
      el.appendChild(inputBottom);
    } else {
      contentTop = contentBottom = el.innerText;
      let input = document.createElement('input');
      input.className = 'table__input';
      input.value = contentTop;
      el.innerHTML = '';
      el.appendChild(input);
      let inputBottom = document.createElement('input');
      inputBottom.className = 'table__input';
      el.appendChild(inputBottom);
    }
  });
};

const rewriteDOMForView = parsedData => {
  console.log(parsedData);
  const data = parsedData[0].storage;
  if (!data[0][0].hasOwnProperty('top')) {
    return;
  }
  console.log(data);
  $('.table__row-wrapper').each((i, cell) => {
    let row = Array.from(cell.children);
    row.forEach((el, j) => {
      if (data[i][j].top === data[i][j].bottom) {
        el.innerHTML = data[i][j].top;
      } else {
        el.innerHTML = '';
        let blockTop = document.createElement('div');
        blockTop.className = 'table__cell--top';
        blockTop.innerText = data[i][j].top;
        el.appendChild(blockTop);
        let blockBottom = document.createElement('div');
        blockBottom.className = 'table__cell--bottom';
        blockBottom.innerText = data[i][j].bottom;
        el.appendChild(blockBottom);
      }
    });
  });
};