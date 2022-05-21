/**
 * A response from an API.
 */
export interface IAPIResponse {
  /**
   * Original URL of the request.
   */
  url: string,

  /**
   * Status code of this response.
   */
  status: number;

  /**
   * Error message of this reponse.
   */
  error: string | null;

  /**
   * Data of this response.
   */
  data: any;
}
