import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter.js';
import { logWarning } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

export default class CustomUploadAdapter extends SimpleUploadAdapter {
  /**
   * @inheritDoc
   */
  init() {
    const options = this.editor.config.get( 'simpleUpload' );

    if ( !options ) {
      return;
    }

    if ( !options.uploadUrl ) {
      /**
       * The {@link module:upload/adapters/simpleuploadadapter~SimpleUploadConfig#uploadUrl `config.simpleUpload.uploadUrl`}
       * configuration required by the {@link module:upload/adapters/simpleuploadadapter~SimpleUploadAdapter `SimpleUploadAdapter`}
       * is missing. Make sure the correct URL is specified for the image upload to work properly.
       *
       * @error simple-upload-adapter-missing-uploadurl
       */
      logWarning( 'simple-upload-adapter-missing-uploadurl' );

      return;
    }

    this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => {
      return new Adapter( loader, options );
    };
  }
}


class Adapter {
  /**
   * Creates a new adapter instance.
   *
   * @param {module:upload/filerepository~FileLoader} loader
   * @param {module:upload/adapters/simpleuploadadapter~SimpleUploadConfig} options
   */
  constructor( loader, options ) {
    /**
     * FileLoader instance to use during the upload.
     *
     * @member {module:upload/filerepository~FileLoader} #loader
     */
    this.loader = loader;

    /**
     * The configuration of the adapter.
     *
     * @member {module:upload/adapters/simpleuploadadapter~SimpleUploadConfig} #options
     */
    this.options = options;
  }

  /**
   * Starts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#upload
   * @returns {Promise}
   */
  upload() {
    return this.loader.file
      .then( file => new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('image', file)
        this.options.axios.post(this.options.uploadUrl, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(res => {
            resolve({
              default: res.data.image_url
            })
          })
          .catch(err => {
            console.error(err)
            reject("Couldn't upload file.")
          })
      } ) );
  }

  /**
   * Aborts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#abort
   * @returns {Promise}
   */
  abort() {
    if ( this.xhr ) {
      this.xhr.abort();
    }
  }
}
