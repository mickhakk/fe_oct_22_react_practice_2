/* eslint-disable jsx-a11y/control-has-associated-label */
import './App.scss';
import cn from 'classnames';
import { useState } from 'react';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const photos = photosFromServer.map((photo) => {
  const album = albumsFromServer
    .find(alb => alb.id === photo.albumId);
  const user = usersFromServer.find(us => us.id === album.userId);

  return { ...photo, album, user };
});

export const AlbumSelector = ({ selectedAlbum, setSelectedAlbum }) => {
  const albumFilter = (albumId) => {
    if (selectedAlbum.includes(albumId)) {
      setSelectedAlbum(prevSelected => prevSelected
        .filter(id => id !== albumId));
    } else {
      setSelectedAlbum(prevSelected => [...prevSelected, albumId]);
    }
  };

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        className={cn(
          'button',
          'is-success',
          'mr-6',
          {
            'is-outlined': selectedAlbum.length !== 0,
          },
        )}
        onClick={() => setSelectedAlbum([])}
      >
        All
      </a>

      {albumsFromServer.map(album => (
        <a
          className={cn(
            'button',
            'mr-2',
            'my-1',
            {
              'is-info': selectedAlbum.includes(album.id),
            },
          )}
          href="#/"
          key={album.id}
          onClick={() => albumFilter(album.id)}
        >
          {album.title}
        </a>
      ))}
    </div>
  );
};

export const PhotosList = ({
  selectedUser,
  filterName,
  selectedAlbum,
  photosState,
  setPhotosState,
}) => {
  const moveUp = (index) => {
    if (index > 0) {
      const newPhotos = [...photosState];

      [newPhotos[index - 1],
        newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
      setPhotosState(newPhotos);
    }
  };

  const moveDown = (index) => {
    if (index < photosState.length - 1) {
      const newPhotos = [...photosState];

      [newPhotos[index],
        newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
      setPhotosState(newPhotos);
    }
  };

  const filteredPhotos = photosState
    .filter(item => (
      (!selectedUser || item.user.id === selectedUser.id)
      && (item.title.toLowerCase().includes(filterName.toLowerCase()))
      && (selectedAlbum.length === 0 || selectedAlbum.includes(item.albumId))
    ));

  return (
    <div className="box table-container">
      {filteredPhotos.length === 0 ? (
        <p>
          No photos matching selected criteria
        </p>
      ) : (
        <table
          className="table is-striped is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  ID

                  <a href="#/">
                    <span className="icon">
                      <i className="fas fa-sort" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Photo name

                  <a href="#/">
                    <span className="icon">
                      <i className="fas fa-sort-down" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  Album name

                  <a href="#/">
                    <span className="icon">
                      <i className="fas fa-sort-up" />
                    </span>
                  </a>
                </span>
              </th>

              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  User name

                  <a href="#/">
                    <span className="icon">
                      <i className="fas fa-sort" />
                    </span>
                  </a>
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPhotos.map((photo, index) => (
              <tr key={photo.id}>
                <td className="has-text-weight-bold">{photo.id}</td>
                <td>{photo.title}</td>
                <td>{photo.album.title}</td>
                <td
                  className={cn({
                    'has-text-link': photo.user.sex === 'm',
                    'has-text-danger': photo.user.sex === 'f',
                  })}
                >
                  {photo.user.name}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    data-cy={`MoveUpButton-${photo.id}`}
                    className="button is-small is-info"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    data-cy={`MoveDownButton-${photo.id}`}
                    className="button is-small is-info"
                  >
                    &darr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const ResetAllButton = ({
  setSelectedUser,
  setFilterName,
  setSelectedAlbum,
  setPhotosState,
}) => {
  const resetAllFilters = () => {
    setSelectedUser(null);
    setFilterName('');
    setSelectedAlbum([]);
    setPhotosState(photos);
  };

  return (
    <div className="panel-block">
      <a
        href="#/"
        className="button is-link is-outlined is-fullwidth"
        onClick={resetAllFilters}
      >
        Reset all filters
      </a>
    </div>
  );
};

export const SearchField = ({ filterName, setFilterName }) => {
  const clearButtonClick = () => {
    setFilterName('');
  };

  const inputChange = (event) => {
    setFilterName(event.target.value);
  };

  return (
    <div className="panel-block">
      <p className="control has-icons-left has-icons-right is-expanded">
        <input
          type="text"
          className="input"
          placeholder="Search"
          value={filterName}
          onChange={inputChange}
        />

        <span className="icon is-left">
          <i className="fas fa-search" aria-hidden="true" />
        </span>

        {filterName && (
          <span className="icon is-right">
            <button
              type="button"
              className="delete"
              onClick={clearButtonClick}
            />
          </span>
        )}
      </p>
    </div>

  );
};

export const UsersFilterList = ({ selectedUser, setSelectedUser }) => {
  const userFilter = (user) => {
    setSelectedUser(user);
  };

  return (
    <p className="panel-tabs has-text-weight-bold">
      <a
        href="#/"
        className={cn({
          'is-active': !selectedUser,
        })}
        onClick={() => userFilter(null)}
      >
        All
      </a>

      {usersFromServer.map(user => (
        <a
          key={user.id}
          href="#/"
          className={cn({
            'is-active': selectedUser && selectedUser.id === user.id,
          })}
          onClick={() => userFilter(user)}
        >
          {user.name}
        </a>
      ))}
    </p>
  );
};

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [photosState, setPhotosState] = useState(photos);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <UsersFilterList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
            <SearchField
              filterName={filterName}
              setFilterName={setFilterName}
            />

            <AlbumSelector
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}
            />

            <ResetAllButton
              setSelectedUser={setSelectedUser}
              setFilterName={setFilterName}
              setSelectedAlbum={setSelectedAlbum}
              setPhotosState={setPhotosState}
            />

          </nav>
        </div>

        <PhotosList
          selectedUser={selectedUser}
          filterName={filterName}
          selectedAlbum={selectedAlbum}
          photosState={photosState}
          setPhotosState={setPhotosState}
        />
      </div>
    </div>
  );
};
