import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from '../action/post';
import * as api from '../../API/post';

function buildFormDataFromAction(action) {
  const formData = new FormData();

  const {
    imageFile1,
    imageFile2,
    imageFile3,
    imageFile4,
    imageFile5,
    videoFile1,
    videoFile2,
    videoFile3,
    videoFile4,
    videoFile5,
    thumbnail1,
    thumbnail2,
    thumbnail3,
    thumbnail4,
    thumbnail5,
    title,
    description,
    category,
    pattern,
    storeisActive,
    storeIconSize,
    storeId,
    storeUrl,
    productisActive,
    productIconSize,
    ProductId,
    productUrl,
    autoplay1,
    autoplay2,
    autoplay3,
    autoplay4,
    autoplay5,
    facebookurl,
    instagramurl,
    whatsappnumberurl,
    storelinkurl,
    facebook,
    instagram,
    whatsapp,
    storeLink,
  } = action;

  const maybeAppend = (key, value) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  };

  // Text fields
  maybeAppend('title', title);
  maybeAppend('description', description);
  maybeAppend('category', category);
  maybeAppend('pattern', pattern);

  maybeAppend('storeisActive', storeisActive);
  maybeAppend('storeIconSize', storeIconSize);
  maybeAppend('storeId', storeId);
  maybeAppend('storeUrl', storeUrl);

  maybeAppend('productisActive', productisActive);
  maybeAppend('productIconSize', productIconSize);
  maybeAppend('ProductId', ProductId);
  maybeAppend('productUrl', productUrl);

  maybeAppend('autoplay1', autoplay1);
  maybeAppend('autoplay2', autoplay2);
  maybeAppend('autoplay3', autoplay3);
  maybeAppend('autoplay4', autoplay4);
  maybeAppend('autoplay5', autoplay5);

  maybeAppend('facebookurl', facebookurl);
  maybeAppend('instagramurl', instagramurl);
  maybeAppend('whatsappnumberurl', whatsappnumberurl);
  maybeAppend('storelinkurl', storelinkurl);


    maybeAppend('facebook', facebook);
  maybeAppend('instagram', instagram);
  maybeAppend('whatsapp', whatsapp);
  maybeAppend('storeLink', storeLink);

  // Media helpers
  const appendFile = (key, file) => {
    if (file && (file.uri || file.path)) {
      formData.append(key, {
        uri: file.uri || file.path,
        type: file.type || 'application/octet-stream',
        name: file.fileName || file.name || `${key}`,
      });
    }
  };

  appendFile('imageFile1', imageFile1);
  appendFile('imageFile2', imageFile2);
  appendFile('imageFile3', imageFile3);
  appendFile('imageFile4', imageFile4);
  appendFile('imageFile5', imageFile5);

  appendFile('videoFile1', videoFile1);
  appendFile('videoFile2', videoFile2);
  appendFile('videoFile3', videoFile3);
  appendFile('videoFile4', videoFile4);
  appendFile('videoFile5', videoFile5);

  appendFile('thumbnail1', thumbnail1);
  appendFile('thumbnail2', thumbnail2);
  appendFile('thumbnail3', thumbnail3);
  appendFile('thumbnail4', thumbnail4);
  appendFile('thumbnail5', thumbnail5);

  return formData;
}

function* getAllPostsSaga() {
  try {
    const response = yield call(api.getallPost);
    if (response.status === 200) {
      yield put(actions.getallsuccessful(response.data, 'Posts fetched'));
    } else {
      yield put(actions.getallpostfail({
        error: [`Unexpected response status: ${response.status}`, response.data?.error],
      }));
    }
  } catch (error) {
    yield put(actions.getallpostfail({
      error: ['An error occurred', error.message || 'Unknown error'],
    }));
  }
}

function* addPostSaga(action) {
  try {
    const formData = buildFormDataFromAction(action);
    const response = yield call(api.uploadPost, formData);
    if (response.status === 201 || response.status === 200) {
      yield put(actions.uploadpostsuccessful(response.data, 'Post created'));
    } else {
      yield put(actions.uploadpostfail({
        error: [`Unexpected response status: ${response.status}`, response.data?.error],
      }));
    }
  } catch (error) {
    yield put(actions.uploadpostfail({
      error: ['An error occurred', error.message || 'Unknown error'],
    }));
  }
}

function* deletePostSaga(action) {
  try {
    const response = yield call(api.DeletePost, action.postId);
    if (response.status === 200) {
      // Some APIs return the deleted entity; if not, include id
      const data = response.data && Object.keys(response.data).length ? response.data : { id: action.postId };
      yield put(actions.deletepostsuccessful(data, 'Post deleted'));
    } else {
      yield put(actions.deletepostfail({
        error: [`Unexpected response status: ${response.status}`, response.data?.error],
      }));
    }
  } catch (error) {
    yield put(actions.deletepostfail({
      error: ['An error occurred', error.message || 'Unknown error'],
    }));
  }
}

export function* watchPostSaga() {
  yield takeLatest('GET_ALL_POST_REQUEST', getAllPostsSaga);
  yield takeLatest('ADD_POST_REQUEST', addPostSaga);
  yield takeLatest('DELETE_POST_REQUEST', deletePostSaga);
}

export default function* postrootSaga() {
  yield watchPostSaga();
}

