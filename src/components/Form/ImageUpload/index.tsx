import * as React from 'react';
import * as classnames from 'classnames';
import { FieldProps } from 'formik';
import * as get from 'lodash/fp/get';
import './style.scss';
import { Component } from 'react';
import Modal from '@src/components/Modal';
import Loader from '@src/components/Loader';
import Dropzone from 'react-dropzone';
import { getToken } from '@src/auth';
import { apiUrls } from '@src/config';
import isAbsoluteUrl from '@src/lib/isAbsoluteUrl';

interface UploadPromptProps {
  image?: string;
}

interface UploadPromptCallbacks {
  onDoneUpload: (filename: string) => void;
  onCancel: () => void;
}

interface UploadPromptState {
  error: string;
  isUploading: false;
}

class UploadPrompt extends Component<UploadPromptProps & UploadPromptCallbacks> {
  state: UploadPromptState = { isUploading: false, error: '' };

  uploadImage = (files) => {
    this.setState({ isUploading: true, error: '' });

    const token = getToken();
    const file = files[0];

    const formData = new FormData();
    formData.append('file', file);

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/Jason',
        'Conent-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      body: formData
    };

    fetch(apiUrls.uploadImage, requestOptions)
      .then((res) => {
        if (res.status !== 200) {
          throw res;
        }

        return res.json();
      })
      .then((res) => {
        const imagePath = res.filename;
        this.setState({ isUploading: false, error: '' });

        this.props.onDoneUpload(imagePath);
      })
      .catch((err) => {
        console.warn('Error occurred while uploading image', err);
        this.setState({ isUploading: false, error: err.message || 'Failed to upload image.' });
      });
  };

  handleRejection = () => {
    this.setState({
      isUploading: false,
      error: 'Invalid file format. Please try with a valid image.'
    });
  };

  render() {
    const { image } = this.props;

    return (
      <div styleName="prompt-container">
        <Loader isVisible={this.state.isUploading} />

        <Dropzone
          style={{ position: 'relative' }}
          accept="image/*"
          multiple={false}
          onDropAccepted={this.uploadImage}
          onDropRejected={this.handleRejection}
          onFileDialogCancel={() => this.props.onDoneUpload('')}
        >
          <div styleName={`prompt-content${this.state.error ? '-with-error' : ''}`}>
            <div
              styleName="upload-message"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${image})`
              }}
            >
              <i styleName="upload-icon" />
              <span styleName="message-text">Drag and drop the image here</span>
            </div>

            {this.state.error && <div styleName="error">{this.state.error}</div>}
          </div>
        </Dropzone>

        <button
          type="button"
          styleName={`done-button${image ? '-success' : ''}`}
          onClick={this.props.onCancel}
        >
          Done
        </button>
      </div>
    );
  }
}

interface Props extends FieldProps {
  placeholder?: string;
  label?: string;
  classNames?: {
    wrapper?: string;
    wrapperHasError?: string;
    wrapperHasWarning?: string;
    field?: string;
    error?: string;
    label?: string;
    warning?: string;
  };
}

interface UploadImageFieldState {
  isPromptOpen: boolean;
}

class UploadImageField extends Component<Props> {
  state: UploadImageFieldState = { isPromptOpen: false };

  showPrompt = () => this.setState({ isPromptOpen: true });
  hidePrompt = () => this.setState({ isPromptOpen: false });

  handleNewImage = (file) => {
    this.props.form.setFieldValue(this.props.field.name, file);
  };

  render() {
    const { field, form, placeholder, label, classNames: cns } = this.props;
    const getFieldValue = get(field.name);

    const touched = getFieldValue(form.touched);
    const error = getFieldValue(form.errors);

    const showError = touched && error;
    const image = isAbsoluteUrl(field.value) ? field.value : apiUrls.uploadedImage(field.value);

    const classNames = {
      wrapper: 'input-group',
      wrapperHasError: 'has-error',
      field: 'form-control',
      error: 'error',
      label: 'label',
      ...(cns || {})
    };

    return (
      <div
        title={label}
        className={classnames(classNames.wrapper, {
          [classNames.wrapperHasError]: showError
        })}
      >
        <Modal isVisible={this.state.isPromptOpen} onClose={this.hidePrompt}>
          <UploadPrompt
            image={image}
            onDoneUpload={this.handleNewImage}
            onCancel={this.hidePrompt}
          />
        </Modal>

        {label && <label className={classNames.label}>{label}</label>}

        <input
          title={label}
          type="hidden"
          className={classNames.field}
          placeholder={placeholder || ''}
          {...field}
        />

        <div
          styleName={`upload-image-tile${showError ? '-with-error' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
          onClick={this.showPrompt}
        >
          {image && <i styleName="change-icon" />}
          {!image && <i styleName="add-icon" />}
        </div>

        {showError && <div className={classNames.error}>{error}</div>}
      </div>
    );
  }
}

export default UploadImageField;
