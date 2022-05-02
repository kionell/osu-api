/**
 * A response from an API.
 */
export interface IAPIResponse {
  /**
   * Original URL of the request.
   */
  url: string,

  /**
   * Data of this response.
   */
  data: any;
}
