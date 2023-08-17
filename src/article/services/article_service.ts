import { SessionView } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import {
  Observable,
  Subject,
  of,
  firstValueFrom,
  share,
  switchMap,
} from "rxjs";

interface FetchRequest {
  article_id?: string;
}

interface AddRequest {
  creator_id: string;
  title: string;
  contents: string;
}

interface ModifyRequest {
  article_id: string;
  title: string;
  contents: string;
}

interface DeleteRequest {
  article_id: string;
}

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
  destroy?: boolean;

  article_id: string;
}

export class ArticleService {
  private readonly networkService = NetworkService.getInstance();
  private readonly fetchRequest$ = new Subject<FetchRequest>();
  private readonly fetchResponse$: Observable<object>;

  private readonly addRequest$ = new Subject<AddRequest>();
  private readonly addResponse$: Observable<object>;

  private readonly modifyRequest$ = new Subject<ModifyRequest>();
  private readonly modifyResponse$: Observable<object>;

  private readonly deleteRequest$ = new Subject<DeleteRequest>();
  private readonly deleteResponse$: Observable<object>;

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: ArticleService;

  private constructor() {
    this.fetchResponse$ = this.fetchRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("article/fetch.php", request).pipe(
          switchMap((response) => {
            if (response.article) {
              this.feedSession({
                article_id: response.article.article_id,
              });
              return this.networkService
                .fetch("article/modify.php", {
                  article_id: response.article.article_id,
                  views: "increment",
                })
                .pipe(
                  switchMap(async (response) => {
                    if (response.article) {
                      const activeViewerResponse = await firstValueFrom(
                        this.networkService.fetch("session/count.php", {
                          type: "article",
                          id: response.article.article_id,
                        })
                      );

                      if (activeViewerResponse.active)
                        response.article.activeViewers =
                          activeViewerResponse.active;
                    }
                    return response;
                  })
                );
            }
            return of(response);
          })
        )
      ),
      share()
    );

    this.addResponse$ = this.addRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("article/add.php", request)
      ),
      share()
    );

    this.modifyResponse$ = this.modifyRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("article/modify.php", request)
      ),
      share()
    );

    this.deleteResponse$ = this.deleteRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("article/delete.php", request)
      ),
      share()
    );

    this.sessionResponse$ = this.sessionRequest$.pipe(
      switchMap((request) => {
        if (!!request.session_id) {
          return !!request.destroy
            ? this.networkService.fetch("session/delete.php", request)
            : this.networkService.fetch("session/update.php", request);
        }

        return this.networkService.fetch("session/create.php", {
          view: SessionView.ARTICLE,
          viewed_id: request.article_id,
        });
      }),
      share()
    );
  }

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }

    return ArticleService.instance;
  }

  feedFetch(request: FetchRequest) {
    this.fetchRequest$.next(request);
  }

  feedAdd(request: AddRequest) {
    this.addRequest$.next(request);
  }

  feedModify(request: ModifyRequest) {
    this.modifyRequest$.next(request);
  }

  feedDelete(request: DeleteRequest) {
    this.deleteRequest$.next(request);
  }

  feedSession(request: SessionRequest) {
    this.sessionRequest$.next(request);
  }

  onFetchResponse(callback: (response: any) => void) {
    const subscriber = this.fetchResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onAddResponse(callback: (response: any) => void) {
    const subscriber = this.addResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyResponse(callback: (response: any) => void) {
    const subscriber = this.modifyResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onDeleteResponse(callback: (response: any) => void) {
    const subscriber = this.deleteResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onSessionResponse(callback: (response: any) => void) {
    const subscriber = this.sessionResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
