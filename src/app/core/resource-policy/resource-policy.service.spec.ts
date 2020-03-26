import { HttpClient } from '@angular/common/http';

import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { ResourcePolicyService } from './resource-policy.service';
import { PolicyType } from './models/policy-type.model';
import { ActionType } from './models/action-type.model';
import { FindListOptions } from '../data/request.models';
import { SearchParam } from '../cache/models/search-param.model';
import { PageInfo } from '../shared/page-info.model';
import { PaginatedList } from '../data/paginated-list';
import { createSuccessfulRemoteDataObject } from '../../shared/testing/utils';
import { RequestEntry } from '../data/request.reducer';
import { RestResponse } from '../cache/response.models';

describe('ResourcePolicyService', () => {
  let scheduler: TestScheduler;
  let service: ResourcePolicyService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;

  const resourcePolicy = {
    id: '1',
    name: null,
    description: null,
    policyType: PolicyType.TYPE_SUBMISSION,
    action: ActionType.READ,
    startDate : null,
    endDate : null,
    type: 'resourcepolicy',
    uuid: 'resource-policy-1',
    _links: {
      eperson: {
        href: 'https://rest.api/rest/api/eperson'
      },
      group: {
        href: 'https://rest.api/rest/api/group'
      },
      self: {
        href: 'https://rest.api/rest/api/resourcepolicies/1'
      },
    }
  };

  const anotherResourcePolicy = {
    id: '2',
    name: null,
    description: null,
    policyType: PolicyType.TYPE_SUBMISSION,
    action: ActionType.WRITE,
    startDate : null,
    endDate : null,
    type: 'resourcepolicy',
    uuid: 'resource-policy-2',
    _links: {
      eperson: {
        href: 'https://rest.api/rest/api/eperson'
      },
      group: {
        href: 'https://rest.api/rest/api/group'
      },
      self: {
        href: 'https://rest.api/rest/api/resourcepolicies/1'
      },
    }
  };
  const endpointURL = `https://rest.api/rest/api/resourcepolicies`;
  const requestURL = `https://rest.api/rest/api/resourcepolicies/${resourcePolicy.id}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const resourcePolicyId = '1';
  const epersonUUID = '8b39g7ya-5a4b-438b-9686-be1d5b4a1c5a';
  const groupUUID = '8b39g7ya-5a4b-36987-9686-be1d5b4a1c5a';
  const resourceUUID = '8b39g7ya-5a4b-438b-851f-be1d5b4a1c5a';

  const pageInfo = new PageInfo();
  const array = [resourcePolicy, anotherResourcePolicy ];
  const paginatedList = new PaginatedList(pageInfo, array);
  const resourcePolicyRD = createSuccessfulRemoteDataObject(resourcePolicy);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const responseCacheEntry = new RequestEntry();
  responseCacheEntry.response = new RestResponse(true, 200, 'Success');

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: resourcePolicyRD
      }),
      buildList: hot('a|', {
        a: paginatedListRD
      }),
    });
    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new ResourcePolicyService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'findByHref').and.callThrough();
    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'getSearchByHref').and.returnValue(observableOf(requestURL));
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(resourcePolicyId));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(resourcePolicyId);
    });

    it('should return a RemoteData<ResourcePolicy> for the object with the given id', () => {
      const result = service.findById(resourcePolicyId);
      const expected = cold('a|', {
        a: resourcePolicyRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('findByHref', () => {
    it('should proxy the call to dataservice.findByHref', () => {
      scheduler.schedule(() => service.findByHref(requestURL));
      scheduler.flush();

      expect((service as any).dataService.findByHref).toHaveBeenCalledWith(requestURL);
    });

    it('should return a RemoteData<ResourcePolicy> for the object with the given URL', () => {
      const result = service.findByHref(requestURL);
      const expected = cold('a|', {
        a: resourcePolicyRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('searchByEPerson', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [new SearchParam('uuid', epersonUUID)];
      scheduler.schedule(() => service.searchByEPerson(epersonUUID));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByEPersonMethod, options);
    });

    it('should proxy the call to dataservice.searchBy with additional search param', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new SearchParam('uuid', epersonUUID),
        new SearchParam('resource', resourceUUID),
      ];
      scheduler.schedule(() => service.searchByEPerson(epersonUUID, resourceUUID));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByEPersonMethod, options);
    });

    it('should return a RemoteData<PaginatedList<ResourcePolicy>) for the search', () => {
      const result = service.searchByEPerson(epersonUUID, resourceUUID);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

  });

  describe('searchByGroup', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [new SearchParam('uuid', groupUUID)];
      scheduler.schedule(() => service.searchByGroup(groupUUID));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByGroupMethod, options);
    });

    it('should proxy the call to dataservice.searchBy with additional search param', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new SearchParam('uuid', groupUUID),
        new SearchParam('resource', resourceUUID),
      ];
      scheduler.schedule(() => service.searchByGroup(groupUUID, resourceUUID));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByGroupMethod, options);
    });

    it('should return a RemoteData<PaginatedList<ResourcePolicy>) for the search', () => {
      const result = service.searchByGroup(groupUUID);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

  });

  describe('searchByResource', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [new SearchParam('uuid', resourceUUID)];
      scheduler.schedule(() => service.searchByResource(resourceUUID));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByResourceMethod, options);
    });

    it('should proxy the call to dataservice.searchBy with additional search param', () => {
      const action = ActionType.READ;
      const options = new FindListOptions();
      options.searchParams = [
        new SearchParam('uuid', resourceUUID),
        new SearchParam('action', action),
      ];
      scheduler.schedule(() => service.searchByResource(resourceUUID, action));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchByResourceMethod, options);
    });

    it('should return a RemoteData<PaginatedList<ResourcePolicy>) for the search', () => {
      const result = service.searchByResource(resourceUUID);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });
  });
});
