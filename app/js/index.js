'use strict';
let currentState = Array(8).fill(Array(5));
console.log(currentState.slice());
let selectedGroup,
  selectedPeople,
  selectedRoom;

const getInitState = (group = '') => {
  const groupName = group === '' ? selectedGroup : group;
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/storage?group=' + groupName;
  xhr.open('GET', url, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
};

const getStateByPeople = _ => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/people';
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      people: selectedPeople
    })
  );
  return JSON.parse(xhr.responseText);
};

const getStateByRoom = _ => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/room';
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      room: selectedRoom
    })
  );
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
      let contentTop = el.children[0].value,
        roomTop = el.children[1].value,
        peopleTop = el.children[2].value,
        contentBottom = el.children[3].value,
        roomBottom = el.children[4].value,
        peopleBottom = el.children[5].value;
      res[j] = contentTop === contentBottom
      && peopleTop === peopleBottom
      && roomTop === roomBottom ? {
        'top': {
          context: contentTop,
          room: roomTop,
          people: peopleTop
        },
        'bottom': {
          context: contentTop,
          room: roomTop,
          people: peopleTop
        }
      } : {
        'top': {
          context: contentTop,
          room: roomTop,
          people: peopleTop
        },
        'bottom': {
          context: contentBottom,
          room: roomBottom,
          people: peopleBottom
        }
      };

    });
    currentState.push(res);
  });
  postState(currentState.slice());
  initDropdown();
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

const getAllPeople = _ => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/people';
  xhr.open('GET', url, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
};

const getAllRoom = _ => {
  let xhr = new XMLHttpRequest();
  const url = 'http://localhost:8000/room';
  xhr.open('GET', url, false);
  xhr.send();
  return JSON.parse(xhr.responseText);
};

const initDropdown = _ => {
  let groupsName = getAllGroup();
  groupsName.forEach(el => {
    let option = document.createElement('option');
    option.value = el;
    option.innerText = el;
    $('#group_select').get(0).appendChild(option);
  });

  let roomsName = getAllRoom();
  console.log(roomsName);
  roomsName.forEach(el => {
    let option = document.createElement('option');
    option.value = el;
    option.innerText = el;
    $('#room_select').get(0).appendChild(option);
  });

  let peoplesName = getAllPeople();
  peoplesName.forEach(el => {
    let option = document.createElement('option');
    option.value = el;
    option.innerText = el;
    $('#people_select').get(0).appendChild(option);
  });
};

window.onload = () => {
  initDropdown();

  $('#group_select option')[0].selected = true;
  selectedGroup = $('#group_select option')[0].value;
  selectedPeople = selectedRoom = '';
  $('#group_select').change(_ => {
    $('#group_select option').each((i, el) => {
      if (el.selected) {
        selectedGroup = el.value;
      }
    });
    rewriteDOMForView(getInitState());
  });

  $('#room_select').change(_ => {
    selectedGroup = selectedPeople = '';
    $('#room_select option').each((i, el) => {
      if (el.selected) {
        selectedRoom = el.value;
      }
    });
    rewriteDOMForView(getStateByRoom());
  });

  $('#people_select').change(_ => {
    selectedGroup = selectedRoom = '';
    $('#people_select option').each((i, el) => {
      if (el.selected) {
        selectedPeople = el.value;
      }
    });
    rewriteDOMForView(getStateByPeople());
  });
  rewriteDOMForView(getInitState());
};
const rewriteDOMForEdit = _ => {
  $('.btn.btn--edit').addClass('btn--hide');
  $('.btn.btn--save').removeClass('btn--hide');
  $('.btn.btn--cancel').removeClass('btn--hide');

  $('.table__row-wrapper .table__cell').each((i, el) => {
    let contentTop = '',
      contentBottom = '',
      roomTop = '',
      roomBottom = '',
      peopleTop = '',
      peopleBottom = '';
    if (el.children.length === 2) {
      console.log('im in');
      console.log(el.children[0]);
      console.log(el.children[0].children[0]);

      contentTop = el.children[0].children[0].innerText;
      roomTop = el.children[0].children[1].innerText;
      peopleTop = el.children[0].children[2].innerText;
      contentBottom = el.children[1].children[0].innerText;
      roomBottom = el.children[1].children[1].innerText;
      peopleBottom = el.children[1].children[2].innerText;
      let res = createNodeCell({
        context: contentTop,
        room: roomTop,
        people: peopleTop
      }, 'input') + createNodeCell({
        context: contentBottom,
        room: roomBottom,
        people: peopleBottom
      }, 'input');
      el.innerHTML = res;
    } else {
      contentTop = contentBottom = el.children[0].innerText;
      roomTop = roomBottom = el.children[1].innerText;
      peopleTop = peopleBottom = el.children[2].innerText;
      let res = createNodeCell({
        context: contentTop,
        room: roomTop,
        people: peopleTop
      }, 'input') + createNodeCell({
        context: contentTop,
        room: roomTop,
        people: peopleTop
      }, 'input');
      el.innerHTML = res;
    }
  });
};

const rewriteDOMForView = parsedData => {
  console.log(parsedData);
  const data = parsedData[0].storage;

  $('.table__row-wrapper').each((i, cell) => {
    let row = Array.from(cell.children);
    row.forEach((el, j) => {
      if (data[i][j].top.context === data[i][j].bottom.context
        && data[i][j].top.room === data[i][j].bottom.room
        && data[i][j].top.people === data[i][j].bottom.people) {
        el.innerHTML = createNodeCell(data[i][j].top, 'div');
      } else {
        el.innerHTML = '';
        let blockTop = document.createElement('div');
        blockTop.className = 'table__cell--top';
        blockTop.innerHTML = createNodeCell(data[i][j].top, 'div');
        el.appendChild(blockTop);
        let blockBottom = document.createElement('div');
        blockBottom.className = 'table__cell--bottom';
        blockBottom.innerHTML = createNodeCell(data[i][j].bottom, 'div');
        el.appendChild(blockBottom);
      }
    });
  });
};

const createNodeCell = (data, tag) => {
  let res = `<${tag} value='${data.context}'>${tag !== 'input' ? data.context : ''}</${tag}>
             <${tag} value='${data.room}'>${tag !== 'input' ? data.room : ''}</${tag}>
             <${tag} value='${data.people}'>${tag !== 'input' ? data.people : ''}</${tag}>`;
  return res;
};